import { decodeToken, verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const tokenOk = await verifyToken(token);
  const decoded = decodeToken(token);
  let allowInternal = false;
  if (tokenOk && decoded !== null) {
    const user = await prisma.user.findUnique({ where: { id: decoded.user.id } });
    if (user && user.hasAccount && user.isClubMember) allowInternal = true;
  }
  const now = new Date();
  const data = await prisma.competition.findMany({
    where: {
      lockEnroll: false,
      enrollStart: { lte: now },
      enrollEnd: { gte: now },
      isInternal: allowInternal ? undefined : false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return Response.json(data, { status: 200 });
}
