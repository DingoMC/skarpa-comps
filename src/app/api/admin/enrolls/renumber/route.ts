import { verifyToken } from '@/lib/auth';
import { ADMIN_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { RENUMBER_ORDER_OPTIONS } from '@/modules/admin/enrolls/constants';
import { User_Competition } from '@prisma/client';
import { getCookie } from 'cookies-next';
import { randomInt } from 'crypto';
import { NextRequest } from 'next/server';

interface EnrollWithCategory extends User_Competition {
  category: { seq: number };
}

function randomShuffle(array: EnrollWithCategory[]) {
  const arr = array.slice();

  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

const triStateOrderField = (match: string, orderBy: string) => {
  if (!orderBy.startsWith(match)) return undefined;
  if (orderBy.endsWith('Asc')) return 'asc';
  return 'desc';
};

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const compId = req.nextUrl.searchParams.get('competition_id');
  if (!compId || !compId.length) {
    return Response.json({ message: 'Brak identyfikatora zawodów.' }, { status: 400 });
  }
  const found = await prisma.competition.findUnique({ where: { id: compId.trim() } });
  if (!found) {
    return Response.json({ message: 'Nieprawidłowy identyfikator zawodów.' }, { status: 400 });
  }
  const { startNumber, orderBy, group, safetyGap, nextFromMultipleOf } = await req.json();
  const startNumberCorr = typeof startNumber === 'number' ? startNumber : 0;
  const orderByCorr = typeof orderBy === 'string' ? orderBy.trim() : '';
  const groupCorr = typeof group === 'boolean' ? group : false;
  const safetyGapCorr = typeof safetyGap === 'number' ? safetyGap : 0;
  const nextFromMultipleOfCorr = typeof nextFromMultipleOf === 'number' ? nextFromMultipleOf : null;
  if (
    startNumberCorr <= 0
    || !orderByCorr.length
    || !RENUMBER_ORDER_OPTIONS.map((v) => v.value).includes(orderByCorr)
    || (nextFromMultipleOfCorr !== null && nextFromMultipleOfCorr <= 1)
  ) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const enrolls = await prisma.user_Competition.findMany({
    where: { competitionId: compId.trim() },
    include: { category: { select: { seq: true } } },
    orderBy: {
      createdAt: triStateOrderField('createdAt', orderByCorr),
      user:
        orderByCorr.startsWith('gender') || orderByCorr.startsWith('firstName') || orderByCorr.startsWith('lastName')
          ? {
            gender: triStateOrderField('gender', orderByCorr),
            firstName: triStateOrderField('firstName', orderByCorr),
            lastName: triStateOrderField('lastName', orderByCorr),
          }
          : undefined,
    },
  });
  if (!enrolls.length) {
    return Response.json({ message: 'Nie znaleziono zapisanych osób na te zawody.' }, { status: 200 });
  }
  const sortedEnrolls = orderByCorr === 'random' ? randomShuffle(enrolls) : [...enrolls];
  let sortedEnrollsFinal: EnrollWithCategory[] = [];
  if (groupCorr) {
    const categories: { id: string; seq: number }[] = [];
    sortedEnrolls.forEach((e) => {
      if (!categories.find((c) => c.id === e.categoryId)) categories.push({ id: e.categoryId, seq: e.category.seq });
    });
    categories.sort((a, b) => a.seq - b.seq);
    const groupedEnrolls: { [key: string]: EnrollWithCategory[] } = {};
    sortedEnrolls.forEach((e) => {
      if (groupedEnrolls[e.categoryId]) {
        groupedEnrolls[e.categoryId].push({ ...e });
      } else {
        groupedEnrolls[e.categoryId] = [{ ...e }];
      }
    });
    categories.forEach((c) => {
      if (groupedEnrolls[c.id]) {
        sortedEnrollsFinal.push(...groupedEnrolls[c.id]);
      }
    });
  } else {
    sortedEnrollsFinal = [...sortedEnrolls];
  }
  let startNo = startNumberCorr;
  let success = 0;
  let errors = 0;
  for (let i = 0; i < sortedEnrollsFinal.length; i++) {
    const elPrev = i > 0 ? { ...sortedEnrollsFinal[i - 1] } : undefined;
    const el = { ...sortedEnrollsFinal[i] };
    const groupChanged = elPrev ? el.categoryId !== elPrev.categoryId : false;
    if (groupCorr && groupChanged) {
      startNo += safetyGapCorr;
      if (nextFromMultipleOfCorr !== null && startNo % nextFromMultipleOfCorr !== 0) {
        const baseNo = startNo - (startNo % nextFromMultipleOfCorr);
        startNo = baseNo + nextFromMultipleOfCorr;
      }
    }
    try {
      await prisma.user_Competition.update({ where: { id: el.id }, data: { startNumber: startNo } });
      success++;
      startNo++;
    } catch (error) {
      console.error(error);
      errors++;
    }
  }
  return Response.json(
    {
      message: `Zaktualizowano pomyślnie numery startowe
        ${success} z ${sortedEnrollsFinal.length} osób.${errors > 0 ? ` Błędów: ${errors}.` : ''}`,
    },
    { status: 200 }
  );
}
