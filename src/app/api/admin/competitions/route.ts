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
  const compId = req.nextUrl.searchParams.get('id');
  if (compId !== null && compId.length) {
    const found = await prisma.competition.findUnique({ where: { id: compId.trim() } });
    if (found === null) {
      return Response.json({ message: 'Nie znaleziono zawodów o podanym identyfikatorze.' }, { status: 400 });
    }
    return Response.json(found, { status: 200 });
  }
  const data = await prisma.competition.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const {
    name,
    description,
    lockResults,
    lockEnroll,
    allowFamilyRanking,
    familySettings,
    pzaSettings,
    selfScoringSettings,
    isInternal,
    clubMembersPay,
    startDate,
    endDate,
    enrollStart,
    enrollEnd,
  } = await req.json();
  const nameCorr = typeof name === 'string' ? name.trim() : '';
  const descriptionCorr = typeof description === 'string' ? description.trim() : '';
  const lockResultsCorr = typeof lockResults === 'boolean' ? lockResults : false;
  const lockEnrollCorr = typeof lockEnroll === 'boolean' ? lockEnroll : false;
  const allowFamilyRankingCorr = typeof allowFamilyRanking === 'boolean' ? allowFamilyRanking : false;
  const familySettingsCorr = typeof familySettings === 'string' ? familySettings : null;
  const pzaSettingsCorr = typeof pzaSettings === 'string' ? pzaSettings : null;
  const selfScoringSettingsCorr = typeof selfScoringSettings === 'string' ? selfScoringSettings : null;
  const isInternalCorr = typeof isInternal === 'boolean' ? isInternal : false;
  const clubMembersPayCorr = typeof clubMembersPay === 'boolean' ? clubMembersPay : false;
  const startDateCorr = typeof startDate === 'number' ? new Date(startDate) : null;
  const endDateCorr = typeof endDate === 'number' ? new Date(endDate) : null;
  const enrollStartCorr = typeof enrollStart === 'number' ? new Date(enrollStart) : null;
  const enrollEndCorr = typeof enrollEnd === 'number' ? new Date(enrollEnd) : null;
  if (
    !nameCorr.length
    || !descriptionCorr.length
    || startDateCorr === null
    || endDateCorr === null
    || enrollStartCorr === null
    || enrollEndCorr === null
  ) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const sameNameComp = await prisma.competition.findFirst({
    where: {
      name: nameCorr,
    },
  });
  if (sameNameComp !== null) {
    return Response.json({ message: 'Zawody o tej samej nazwie już istnieją.' }, { status: 400 });
  }
  try {
    await prisma.competition.create({
      data: {
        name: nameCorr,
        description: descriptionCorr,
        lockResults: lockResultsCorr,
        lockEnroll: lockEnrollCorr,
        allowFamilyRanking: allowFamilyRankingCorr,
        familySettings: familySettingsCorr,
        pzaSettings: pzaSettingsCorr,
        selfScoringSettings: selfScoringSettingsCorr,
        isInternal: isInternalCorr,
        clubMembersPay: clubMembersPayCorr,
        startDate: startDateCorr,
        endDate: endDateCorr,
        enrollStart: enrollStartCorr,
        enrollEnd: enrollEndCorr,
      },
    });
    return Response.json({ message: 'Zawody utworzone pomyślnie.' }, { status: 200 });
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
  const {
    id,
    name,
    description,
    lockResults,
    lockEnroll,
    allowFamilyRanking,
    familySettings,
    pzaSettings,
    selfScoringSettings,
    isInternal,
    clubMembersPay,
    startDate,
    endDate,
    enrollStart,
    enrollEnd,
  } = await req.json();
  const idCorr = typeof id === 'string' ? id.trim() : '';
  const nameCorr = typeof name === 'string' ? name.trim() : '';
  const descriptionCorr = typeof description === 'string' ? description.trim() : '';
  const lockResultsCorr = typeof lockResults === 'boolean' ? lockResults : false;
  const lockEnrollCorr = typeof lockEnroll === 'boolean' ? lockEnroll : false;
  const allowFamilyRankingCorr = typeof allowFamilyRanking === 'boolean' ? allowFamilyRanking : false;
  const familySettingsCorr = typeof familySettings === 'string' ? familySettings : null;
  const pzaSettingsCorr = typeof pzaSettings === 'string' ? pzaSettings : null;
  const selfScoringSettingsCorr = typeof selfScoringSettings === 'string' ? selfScoringSettings : null;
  const isInternalCorr = typeof isInternal === 'boolean' ? isInternal : false;
  const clubMembersPayCorr = typeof clubMembersPay === 'boolean' ? clubMembersPay : false;
  const startDateCorr = typeof startDate === 'number' ? new Date(startDate) : null;
  const endDateCorr = typeof endDate === 'number' ? new Date(endDate) : null;
  const enrollStartCorr = typeof enrollStart === 'number' ? new Date(enrollStart) : null;
  const enrollEndCorr = typeof enrollEnd === 'number' ? new Date(enrollEnd) : null;
  if (
    !nameCorr.length
    || !descriptionCorr.length
    || startDateCorr === null
    || endDateCorr === null
    || enrollStartCorr === null
    || enrollEndCorr === null
  ) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const found = await prisma.competition.findUnique({
    where: {
      id: idCorr,
    },
  });
  if (found === null) {
    return Response.json({ message: 'Zawody o podanym identyfikatorze nie istnieją.' }, { status: 400 });
  }
  const sameNameComp = await prisma.competition.findFirst({
    where: {
      name: nameCorr,
      id: { not: idCorr },
    },
  });
  if (sameNameComp !== null) {
    return Response.json({ message: 'Zawody o tej samej nazwie już istnieją.' }, { status: 400 });
  }
  try {
    await prisma.competition.update({
      where: {
        id: idCorr,
      },
      data: {
        name: nameCorr,
        description: descriptionCorr,
        lockResults: lockResultsCorr,
        lockEnroll: lockEnrollCorr,
        allowFamilyRanking: allowFamilyRankingCorr,
        familySettings: familySettingsCorr,
        pzaSettings: pzaSettingsCorr,
        selfScoringSettings: selfScoringSettingsCorr,
        isInternal: isInternalCorr,
        clubMembersPay: clubMembersPayCorr,
        startDate: startDateCorr,
        endDate: endDateCorr,
        enrollStart: enrollStartCorr,
        enrollEnd: enrollEndCorr,
      },
    });
    return Response.json({ message: 'Zawody zaktualizowano pomyślnie.' }, { status: 200 });
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
  const compId = req.nextUrl.searchParams.get('id');
  if (compId === null || !compId.length) {
    return Response.json({ message: 'Brak identyfikatora zawodów.' }, { status: 400 });
  }
  const found = await prisma.competition.findUnique({ where: { id: compId.trim() } });
  if (found === null) {
    return Response.json({ message: 'Nie znaleziono zawodów o podanym identyfikatorze.' }, { status: 400 });
  }
  try {
    await prisma.competition.delete({ where: { id: compId.trim() } });
    return Response.json({ message: 'Zawody usunięte pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
