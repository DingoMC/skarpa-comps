import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PZASettings } from '@/lib/types/competition';
import { ResultsSummary } from '@/lib/types/results';
import { TaskResult } from '@/lib/types/task';
import { Competition } from '@prisma/client';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

const pzaTakesPlaces = (competition: Competition, categoryId: string) => {
  const { pzaSettings } = competition;
  if (pzaSettings === null || !pzaSettings.length) return false;
  const { pzaTakesPlaces, pzaFilterCategories } = JSON.parse(pzaSettings) as PZASettings;
  if (!pzaTakesPlaces) return false;
  if (pzaFilterCategories === null || !pzaFilterCategories.length) return true;
  return pzaFilterCategories.some((c) => categoryId === c);
};

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const tokenOk = await verifyToken(token);
  const compId = req.nextUrl.searchParams.get('competition_id');
  if (compId === null || !compId.trim().length) {
    return Response.json({ message: 'Nieprawidłowy identyfikator zawodów.' }, { status: 400 });
  }
  const competition = await prisma.competition.findUnique({ where: { id: compId.trim() } });
  if (competition === null) {
    return Response.json({ message: 'Nie znaleziono zawodów o podanym identyfikatorze.' }, { status: 400 });
  }
  if (!tokenOk && competition.isInternal) {
    return Response.json({ message: 'Nie znaleziono zawodów o podanym identyfikatorze.' }, { status: 403 });
  }
  const categoryId = req.nextUrl.searchParams.get('category_id');
  if (categoryId === null || !categoryId.trim().length) {
    return Response.json({ message: 'Nieprawidłowy identyfikator kategorii.' }, { status: 400 });
  }
  const category = await prisma.category.findUnique({ where: { id: categoryId.trim() } });
  if (category === null) {
    return Response.json({ message: 'Nie znaleziono kategorii o podanym identyfikatorze.' }, { status: 400 });
  }
  const tasks = await prisma.task.findMany({ where: { competitionId: competition.id, categories: { some: { categoryId: category.id } } } });
  const users = await prisma.user_Competition.findMany({
    where: { competitionId: competition.id, categoryId: category.id },
    include: { user: { select: { firstName: true, lastName: true, gender: true, yearOfBirth: true, roleId: true } } },
  });
  const resultsSummary: ResultsSummary[] = [];
  for (const u of users) {
    const results = await prisma.task_User.findMany({ where: { userCompId: u.id } });
    const totalScore = results.map((r) => r.score).reduce((acc, cv) => acc + cv, 0);
    const partialScores: Record<string, { score: number; data: TaskResult }> = {};
    for (const r of results) {
      partialScores[r.taskId] = { score: r.score, data: JSON.parse(r.data) as TaskResult };
    }
    resultsSummary.push({ ...u, score: totalScore, place: null, partial: { ...partialScores } });
  }
  const resultsMen = resultsSummary.filter((r) => r.user.gender).toSorted((a, b) => b.score - a.score);
  const resultsWomen = resultsSummary.filter((r) => !r.user.gender).toSorted((a, b) => b.score - a.score);
  const placesForPZA = pzaTakesPlaces(competition, category.id);
  let placeMen = 0;
  let menPZASkipped = 0;
  const resultsMenWithPlaces: ResultsSummary[] = [];
  for (let i = 0; i < resultsMen.length; i++) {
    const curr = resultsMen[i];
    placeMen++;
    if (i > 0) {
      const prevIndex = i - 1 - menPZASkipped;
      if (prevIndex >= 0) {
        const prev = resultsMen[prevIndex];
        if (curr.score === prev.score) placeMen--;
      }
    }
    if (placesForPZA || !curr.isPZAMember) {
      resultsMenWithPlaces.push({ ...curr, place: placeMen });
    } else {
      resultsMenWithPlaces.push({ ...curr, place: null });
      placeMen--;
    }
    if (curr.isPZAMember && !placesForPZA) menPZASkipped++;
    else menPZASkipped = 0;
  }
  let placeWomen = 0;
  let womenPZASkipped = 0;
  const resultsWomenWithPlaces: ResultsSummary[] = [];
  for (let i = 0; i < resultsWomen.length; i++) {
    const curr = resultsWomen[i];
    placeWomen++;
    if (i > 0) {
      const prevIndex = i - 1 - womenPZASkipped;
      if (prevIndex >= 0) {
        const prev = resultsWomen[prevIndex];
        if (curr.score === prev.score) placeWomen--;
      }
    }
    if (placesForPZA || !curr.isPZAMember) {
      resultsWomenWithPlaces.push({ ...curr, place: placeWomen });
    } else {
      resultsWomenWithPlaces.push({ ...curr, place: null });
      placeWomen--;
    }
    if (curr.isPZAMember && !placesForPZA) womenPZASkipped++;
    else womenPZASkipped = 0;
  }
  return Response.json({ men: resultsMenWithPlaces, women: resultsWomenWithPlaces, tasks }, { status: 200 });
}
