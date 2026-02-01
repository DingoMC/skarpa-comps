import { uniqueArray } from '@/lib/array';
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
  if (!compId || !compId.length) {
    return Response.json({ message: 'Brak identyfikatora zawodów.' }, { status: 400 });
  }
  const found = await prisma.competition.findUnique({ where: { id: compId.trim() } });
  if (!found) {
    return Response.json({ message: 'Nieprawidłowy identyfikator zawodów.' }, { status: 400 });
  }
  if (!found.allowFamilyRanking) {
    return Response.json({ message: 'Wybrane zawody nie posiadają klasyfikacji rodzinnej.' }, { status: 400 });
  }
  const families = await prisma.family.findMany({
    where: { competitionId: compId.trim() },
    include: { userFamilies: { select: { userCompId: true } } },
  });
  const users = await prisma.user_Competition.findMany({
    where: { competitionId: compId.trim(), requestsFamilyRanking: true },
    orderBy: { startNumber: 'asc' },
    include: { user: { omit: { password: true } } },
  });
  return Response.json({ families, users }, { status: 200 });
}

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
  const competition = await prisma.competition.findUnique({ where: { id: compId.trim(), allowFamilyRanking: true } });
  if (!competition) {
    return Response.json({ message: 'Nieprawidłowy identyfikator zawodów.' }, { status: 400 });
  }
  const { name, userCompIds } = await req.json();
  const nameCorr = typeof name === 'string' && name.trim().length ? name.trim() : '';
  const userCompIdsCorr = Array.isArray(userCompIds) ? (userCompIds as string[]) : null;
  if (userCompIdsCorr === null || !nameCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  try {
    const family = await prisma.family.create({
      data: {
        name: nameCorr,
        competitionId: competition.id,
      },
    });
    for (const ucid of uniqueArray(userCompIdsCorr)) {
      const found = await prisma.user_Competition.findUnique({
        where: { id: ucid, competitionId: competition.id, requestsFamilyRanking: true },
      });
      if (found) {
        await prisma.user_Family.create({ data: { familyId: family.id, userCompId: found.id } });
      }
    }
    return Response.json({ message: 'OK' }, { status: 200 });
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
  const compId = req.nextUrl.searchParams.get('competition_id');
  if (!compId || !compId.length) {
    return Response.json({ message: 'Brak identyfikatora zawodów.' }, { status: 400 });
  }
  const competition = await prisma.competition.findUnique({ where: { id: compId.trim() } });
  if (!competition) {
    return Response.json({ message: 'Nieprawidłowy identyfikator zawodów.' }, { status: 400 });
  }
  const { familyId, name, userCompIds } = await req.json();
  const familyIdCorr = typeof familyId === 'string' && familyId.trim().length ? familyId.trim() : '';
  const nameCorr = typeof name === 'string' && name.trim().length ? name.trim() : '';
  const userCompIdsCorr = Array.isArray(userCompIds) ? (userCompIds as string[]) : null;
  if (userCompIdsCorr === null || !familyIdCorr.length || !nameCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const family = await prisma.family.findUnique({ where: { id: familyIdCorr, competitionId: competition.id } });
  if (!family) {
    return Response.json({ message: 'Nie znaleziono rodziny o podanym identyfikatorze.' }, { status: 400 });
  }
  const currUserCompIds = (await prisma.user_Family.findMany({ where: { familyId: family.id } })).map((v) => v.userCompId);
  const toCreate = userCompIdsCorr.filter((id) => !currUserCompIds.includes(id));
  const toDelete = currUserCompIds.filter((id) => !userCompIdsCorr.includes(id));
  try {
    await prisma.family.update({ where: { id: family.id }, data: { name: nameCorr } });
    for (const id of toCreate) {
      const userComp = await prisma.user_Competition.findUnique({ where: { id } });
      if (!userComp) continue;
      await prisma.user_Family.create({
        data: {
          userCompId: id,
          familyId: family.id,
        },
      });
    }
    for (const id of toDelete) {
      const userF = await prisma.user_Family.findUnique({ where: { userCompId_familyId: { userCompId: id, familyId: family.id } } });
      if (!userF) continue;
      await prisma.user_Family.delete({
        where: {
          userCompId_familyId: { userCompId: id, familyId: family.id },
        },
      });
    }
    return Response.json({ message: 'OK' }, { status: 200 });
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
  const familyId = req.nextUrl.searchParams.get('id');
  if (familyId === null || !familyId.length) {
    return Response.json({ message: 'Brak identyfikatora rodziny.' }, { status: 400 });
  }
  const found = await prisma.family.findUnique({ where: { id: familyId.trim() } });
  if (found === null) {
    return Response.json({ message: 'Nie znaleziono rodziny o podanym identyfikatorze.' }, { status: 400 });
  }
  try {
    await prisma.family.delete({ where: { id: familyId.trim() } });
    return Response.json({ message: 'Rodzina usunięta pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
