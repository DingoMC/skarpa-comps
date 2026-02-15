import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { FamilySettings } from '@/lib/types/competition';
import { FamilyResultsPartial, FamilyResultsSummary } from '@/lib/types/results';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

const includedByPZASettings = (settings: FamilySettings, member: FamilyResultsPartial) => {
  if (!member.isPZAMember) return true;
  if (!settings.includePZAMembers) return false;
  if (settings.pzaFilterCategories === null || !settings.pzaFilterCategories.length) return true;
  return settings.pzaFilterCategories.includes(member.categoryId);
};

const changeIncludeByTopN = (settings: FamilySettings, members: FamilyResultsPartial[]) => {
  const newMembers = members.toSorted((a, b) => b.score - a.score);
  if (settings.include === 'all') return [...newMembers];
  const toInclude = settings.topN;
  let cnt = 0;
  const updatedMembers: FamilyResultsPartial[] = [];
  for (const m of newMembers) {
    if (cnt <= toInclude && m.included) {
      updatedMembers.push({ ...m });
      cnt++;
    } else {
      updatedMembers.push({ ...m, included: false });
    }
  }
  return [...updatedMembers];
};

const calculateFamilyScore = (settings: FamilySettings, members: FamilyResultsPartial[]) => {
  if (!members.length) return 0;
  if (settings.aggregation === 'best') return Math.max(...members.filter((m) => m.included).map((m) => m.score));
  if (settings.aggregation === 'sum')
    return members
      .filter((m) => m.included)
      .map((m) => m.score)
      .reduce((acc, cv) => acc + cv, 0);
  return (
    members
      .filter((m) => m.included)
      .map((m) => m.score)
      .reduce((acc, cv) => acc + cv, 0) / members.length
  );
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
  if (!competition.allowFamilyRanking || competition.familySettings === null) {
    return Response.json({ data: [] }, { status: 200 });
  }
  const settings = JSON.parse(competition.familySettings) as FamilySettings;
  const families = await prisma.family.findMany({
    where: { competitionId: competition.id },
    include: {
      userFamilies: {
        include: {
          userComp: { include: { user: { select: { firstName: true, lastName: true, gender: true, yearOfBirth: true, roleId: true } } } },
        },
      },
    },
  });
  // Get all families with members
  const resultsSummary: FamilyResultsSummary[] = [];
  for (const f of families) {
    resultsSummary.push({
      ...f,
      score: 0,
      place: 0,
      members: f.userFamilies.map((uf) => ({ ...uf.userComp, ...uf.userComp.user, score: 0, included: false })),
    });
  }
  // Calculate scores for each member and family
  const resultsWithScores: FamilyResultsSummary[] = [];
  for (const rs of resultsSummary) {
    const members: FamilyResultsPartial[] = [];
    for (const m of rs.members) {
      const results = await prisma.task_User.findMany({ where: { userCompId: m.id } });
      const totalScore = results.map((r) => r.score).reduce((acc, cv) => acc + cv, 0);
      members.push({ ...m, score: totalScore, included: includedByPZASettings(settings, m) });
    }
    const updatedMembers = changeIncludeByTopN(settings, members);
    resultsWithScores.push({ ...rs, members: [...updatedMembers], score: calculateFamilyScore(settings, updatedMembers) });
  }
  // Set places for each family
  const resultsSorted = resultsWithScores.toSorted((a, b) => b.score - a.score);
  const resutlsWithPlaces: FamilyResultsSummary[] = [];
  let place = 0;
  for (let i = 0; i < resultsSorted.length; i++) {
    const curr = resultsSorted[i];
    place++;
    if (i > 0) {
      const prev = resultsSorted[i - 1];
      if (curr.score === prev.score) place--;
    }
    resutlsWithPlaces.push({ ...curr, place });
  }
  return Response.json(resutlsWithPlaces, { status: 200 });
}
