import { verifyToken } from '@/lib/auth';
import { ADMIN_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const compId = req.nextUrl.searchParams.get('competition_id');
  if (compId !== null && compId.length) {
    const found = await prisma.task.findMany({
      where: { competitionId: compId.trim() },
      include: { categories: { select: { id: true } } },
    });
    return Response.json(found, { status: 200 });
  }
  const data = await prisma.task.findMany({ include: { categories: { select: { id: true } } } });
  return Response.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const { name, shortName, competitionId, type, settings, categoryIds } = await req.json();
  const nameCorr = typeof name === 'string' ? name.trim() : '';
  const typeCorr = typeof type === 'string' ? type.trim() : '';
  const shortNameCorr = typeof shortName === 'string' ? shortName.trim() : '';
  const settingsCorr = typeof settings === 'string' ? settings.trim() : '';
  const compIdCorr = typeof competitionId === 'string' ? competitionId.trim() : '';
  const categoryIdsCorr = Array.isArray(categoryIds) ? categoryIds.map((cid: string) => cid.trim()) : [];
  if (!nameCorr.length || !compIdCorr.length || !shortNameCorr.length || !typeCorr.length || !settingsCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const found = await prisma.competition.findUnique({
    where: {
      id: compIdCorr,
    },
  });
  if (found === null) {
    return Response.json({ message: 'Zawody o podanym identyfikatorze nie istnieją.' }, { status: 400 });
  }
  try {
    const newTask = await prisma.task.create({
      data: {
        competitionId: compIdCorr,
        type: typeCorr,
        name: nameCorr,
        shortName: shortNameCorr,
        settings: settingsCorr,
      },
    });
    for (const catId of categoryIdsCorr) {
      await prisma.task_Category.create({
        data: {
          taskId: newTask.id,
          categoryId: catId,
        },
      });
    }
    return Response.json({ message: 'Zadanie utworzone pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const { id, name, shortName, type, settings, categoryIds } = await req.json();
  const idCorr = typeof id === 'string' ? id.trim() : '';
  const nameCorr = typeof name === 'string' ? name.trim() : '';
  const typeCorr = typeof type === 'string' ? type.trim() : '';
  const shortNameCorr = typeof shortName === 'string' ? shortName.trim() : '';
  const settingsCorr = typeof settings === 'string' ? settings.trim() : '';
  const categoryIdsCorr = Array.isArray(categoryIds) ? categoryIds.map((cid: string) => cid.trim()) : [];
  if (!idCorr.length || !nameCorr.length || !shortNameCorr.length || !typeCorr.length || !settingsCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const found = await prisma.task.findUnique({
    where: {
      id: idCorr,
    },
  });
  if (found === null) {
    return Response.json({ message: 'Zadanie o podanym identyfikatorze nie istnieje.' }, { status: 400 });
  }
  try {
    await prisma.task.update({
      where: { id: idCorr },
      data: {
        type: typeCorr,
        name: nameCorr,
        shortName: shortNameCorr,
        settings: settingsCorr,
      },
    });
    const currCategories = await prisma.task_Category.findMany({ where: { taskId: idCorr } });
    const currCatIds = currCategories.map((v) => v.categoryId);
    const toDelete = currCatIds.filter((cc) => !categoryIdsCorr.includes(cc));
    const toCreate = categoryIdsCorr.filter((nc) => !currCatIds.includes(nc));
    for (const catId of toCreate) {
      await prisma.task_Category.create({
        data: {
          taskId: idCorr,
          categoryId: catId,
        },
      });
    }
    for (const catId of toDelete) {
      await prisma.task_Category.delete({
        where: {
          taskId_categoryId: { taskId: idCorr, categoryId: catId },
        },
      });
    }
    return Response.json({ message: 'Zadanie zaktualizowane pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const taskId = req.nextUrl.searchParams.get('id');
  if (taskId === null || !taskId.length) {
    return Response.json({ message: 'Brak identyfikatora zadania.' }, { status: 400 });
  }
  const found = await prisma.task.findUnique({ where: { id: taskId.trim() } });
  if (found === null) {
    return Response.json({ message: 'Nie znaleziono zadania o podanym identyfikatorze.' }, { status: 400 });
  }
  try {
    await prisma.task.delete({ where: { id: taskId.trim() } });
    return Response.json({ message: 'Zadanie usunięte pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
