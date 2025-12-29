import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const compId = req.nextUrl.searchParams.get('competition_id');
  if (!compId || !compId.length) {
    return Response.json({ message: 'Brak identyfikatora zawodów.' }, { status: 400 });
  }
  const found = await prisma.competition.findUnique({ where: { id: compId.trim() } });
  if (!found) {
    return Response.json({ message: 'Nieprawidłowy identyfikator zawodów.' }, { status: 400 });
  }
  const data = await prisma.user_Competition.findMany({
    where: { competitionId: compId.trim() },
    orderBy: { startNumber: 'asc' },
    include: { user: { select: { firstName: true, lastName: true, gender: true, yearOfBirth: true, roleId: true } } },
  });
  return Response.json(data, { status: 200 });
}
