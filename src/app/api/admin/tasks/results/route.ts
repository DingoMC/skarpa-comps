import { verifyToken } from '@/lib/auth';
import { ADMIN_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { calculateScoreSingle } from '@/lib/results';
import { TaskResult, TaskSettings } from '@/lib/types/task';
import { Task_User } from '@prisma/client';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const taskId = req.nextUrl.searchParams.get('task_id');
  if (taskId === null || !taskId.trim().length) {
    return Response.json({ message: 'Brak identyfikatora zadania.' }, { status: 400 });
  }
  const task = await prisma.task.findUnique({
    where: { id: taskId.trim() },
    include: { categories: { select: { categoryId: true } } },
  });
  if (!task) {
    return Response.json({ message: 'Zadanie o podanym identyfikatorze nie istnieje.' }, { status: 400 });
  }
  const taskCategories = task.categories.map((c) => c.categoryId);
  const users = await prisma.user_Competition.findMany({
    where: { competitionId: task.competitionId, categoryId: { in: taskCategories } },
    include: { user: { select: { firstName: true, lastName: true, gender: true, yearOfBirth: true, roleId: true } } },
    orderBy: { startNumber: 'asc' },
  });
  const results = await prisma.task_User.findMany({
    where: { taskId: taskId.trim() },
  });
  return Response.json({ results, users }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const { results } = await req.json();
  const taskId = req.nextUrl.searchParams.get('task_id');
  if (taskId === null || !taskId.trim().length) {
    return Response.json({ message: 'Brak identyfikatora zadania.' }, { status: 400 });
  }
  const task = await prisma.task.findUnique({
    where: { id: taskId.trim() },
    include: { categories: { select: { categoryId: true } } },
  });
  if (!task) {
    return Response.json({ message: 'Zadanie o podanym identyfikatorze nie istnieje.' }, { status: 400 });
  }
  const resultsCorr = Array.isArray(results) ? (results as Task_User[]) : null;
  if (resultsCorr === null) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const currentResults = await prisma.task_User.findMany({ where: { taskId: taskId.trim() } });
  const toCreate = resultsCorr.filter((r) => !currentResults.some((cr) => cr.taskId === r.taskId && cr.userCompId === r.userCompId));
  const toUpdate = resultsCorr.filter((r) => currentResults.some((cr) => cr.taskId === r.taskId && cr.userCompId === r.userCompId));
  const toDelete = currentResults.filter((r) => !resultsCorr.some((cr) => cr.taskId === r.taskId && cr.userCompId === r.userCompId));
  try {
    for (const r of toCreate) {
      await prisma.task_User.create({
        data: {
          taskId: r.taskId,
          data: r.data,
          userCompId: r.userCompId,
          score: calculateScoreSingle(JSON.parse(r.data) as TaskResult, JSON.parse(task.settings) as TaskSettings),
        },
      });
    }
    for (const r of toUpdate) {
      await prisma.task_User.update({
        where: { taskId_userCompId: { taskId: r.taskId, userCompId: r.userCompId } },
        data: { data: r.data, score: calculateScoreSingle(JSON.parse(r.data) as TaskResult, JSON.parse(task.settings) as TaskSettings) },
      });
    }
    for (const r of toDelete) {
      await prisma.task_User.delete({ where: { taskId_userCompId: { taskId: r.taskId, userCompId: r.userCompId } } });
    }
    return Response.json(
      { message: `Dodano: ${toCreate.length}, Zaktualizowano: ${toUpdate.length}, Usunięto: ${toDelete.length}` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
