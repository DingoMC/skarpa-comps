import { verifyToken } from "@/lib/auth";
import { getCookie } from "cookies-next";
import { NextRequest } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const tokenOk = await verifyToken(token);
  if (!tokenOk) {
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
