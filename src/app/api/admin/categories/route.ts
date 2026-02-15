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
  const categories = await prisma.category.findMany({ where: { competitionId: compId.trim() }, orderBy: { seq: 'asc' } });
  return Response.json(categories, { status: 200 });
}

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const { name, seq, minAge, maxAge, competitionId } = await req.json();
  const compIdCorr = typeof competitionId === 'string' ? competitionId.trim() : '';
  const nameCorr = typeof name === 'string' ? name.trim() : '';
  const seqCorr = typeof seq === 'number' ? seq : 0;
  const minAgeCorr = typeof minAge === 'number' ? minAge : null;
  const maxAgeCorr = typeof maxAge === 'number' ? maxAge : null;
  if (!nameCorr.length || !compIdCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const sameNameCategory = await prisma.category.findFirst({
    where: {
      competitionId: compIdCorr,
      name: nameCorr,
    },
  });
  if (sameNameCategory !== null) {
    return Response.json({ message: 'Kategoria o tej samej nazwie już istnieje.' }, { status: 400 });
  }
  try {
    await prisma.category.create({
      data: {
        name: nameCorr,
        seq: seqCorr,
        minAge: minAgeCorr,
        maxAge: maxAgeCorr,
        competitionId: compIdCorr,
      },
    });
    return Response.json({ message: 'Kategoria utworzona pomyślnie.' }, { status: 200 });
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
  const { id, name, seq, minAge, maxAge } = await req.json();
  const idCorr = typeof id === 'string' ? id.trim() : '';
  const nameCorr = typeof name === 'string' ? name.trim() : '';
  const seqCorr = typeof seq === 'number' ? seq : 0;
  const minAgeCorr = typeof minAge === 'number' ? minAge : null;
  const maxAgeCorr = typeof maxAge === 'number' ? maxAge : null;
  if (!nameCorr.length || !idCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  // Check if category exists in db
  const found = await prisma.category.findUnique({
    where: {
      id: idCorr,
    },
  });
  if (found === null) {
    return Response.json({ message: 'Kategoria o podanym identyfikatorze nie istnieje.' }, { status: 400 });
  }
  const sameNameCategory = await prisma.category.findFirst({
    where: {
      name: nameCorr,
      competitionId: found.competitionId,
      id: { not: idCorr },
    },
  });
  if (sameNameCategory !== null) {
    return Response.json({ message: 'Kategoria o tej samej nazwie już istnieje.' }, { status: 400 });
  }
  try {
    await prisma.category.update({
      where: {
        id: idCorr,
      },
      data: {
        name: nameCorr,
        seq: seqCorr,
        minAge: minAgeCorr,
        maxAge: maxAgeCorr,
      },
    });
    return Response.json({ message: 'Kategoria zakutalizowana pomyślnie.' }, { status: 200 });
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
  const categoryId = req.nextUrl.searchParams.get('id');
  if (categoryId === null || !categoryId.length) {
    return Response.json({ message: 'Brak identyfikatora kategorii.' }, { status: 400 });
  }
  const found = await prisma.category.findUnique({ where: { id: categoryId.trim() } });
  if (found === null) {
    return Response.json({ message: 'Nie znaleziono kategorii o podanym identyfikatorze.' }, { status: 400 });
  }
  try {
    await prisma.category.delete({ where: { id: categoryId.trim() } });
    return Response.json({ message: 'Kategoria usunięta pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
