import { decodeToken, verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CompetitionWithMemberCount } from '@/lib/types/competition';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const tokenOk = await verifyToken(token);
  const decoded = decodeToken(token);
  let allowInternal = false;
  let checkForEnroll = false;
  if (tokenOk && decoded !== null) {
    const user = await prisma.user.findUnique({ where: { id: decoded.user.id } });
    if (user && user.hasAccount) checkForEnroll = true;
    if (user && user.hasAccount && user.isClubMember) allowInternal = true;
  }
  const data: CompetitionWithMemberCount[] = [];
  const comps = await prisma.competition.findMany({
    where: {
      isInternal: allowInternal ? undefined : false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  for (const c of comps) {
    const countAll = await prisma.user_Competition.count({ where: { competitionId: c.id } });
    const countMen = await prisma.user_Competition.count({ where: { competitionId: c.id, user: { gender: true } } });
    let alreadyEnrolled = false;
    if (checkForEnroll) {
      const foundEnroll = await prisma.user_Competition.findFirst({ where: { competitionId: c.id, userId: decoded?.user.id ?? '' } });
      if (foundEnroll) alreadyEnrolled = true;
    }
    const countWomen = countAll - countMen;
    data.push({ ...c, countAll, countMen, countWomen, alreadyEnrolled });
  }
  return Response.json(data, { status: 200 });
}
