import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const compId = req.nextUrl.searchParams.get('competition_id');
  if (!compId || !compId.length) {
    return Response.json({ message: 'Brak identyfikatora zawodów.' }, { status: 400 });
  }
  const data = await prisma.category.findMany({ where: { competitionId: compId.trim() }, orderBy: { seq: 'asc' } });
  return Response.json(data, { status: 200 });
}
