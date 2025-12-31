import { verifyToken } from '@/lib/auth';
import { ADMIN_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { tempEmail } from '@/lib/text';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const enrollId = req.nextUrl.searchParams.get('id');
  if (enrollId !== null && enrollId.length) {
    const foundEnroll = await prisma.user_Competition.findUnique({
      where: { id: enrollId.trim() },
      include: { user: { omit: { password: true } } },
    });
    if (foundEnroll === null) {
      return Response.json({ message: 'Nie znaleziono wpisu o podanym identyfikatorze.' }, { status: 400 });
    }
    return Response.json(foundEnroll, { status: 200 });
  }
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
    include: { user: { omit: { password: true } } },
  });
  return Response.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const {
    competitionId,
    firstName,
    lastName,
    yearOfBirth,
    gender,
    userId,
    categoryId,
    clubName,
    isPZAMember,
    isClubMember,
    startNumber,
    verified,
    underageConsent,
    hasPaid,
    requestsFamilyRanking,
  } = await req.json();
  const compIdCorr = typeof competitionId === 'string' ? competitionId.trim() : '';
  const categoryIdCorr = typeof categoryId === 'string' ? categoryId.trim() : '';
  const userIdCorr = typeof userId === 'string' ? userId.trim() : null;
  const firstNameCorr = typeof firstName === 'string' ? firstName.trim().toLowerCase() : '';
  const lastNameCorr = typeof lastName === 'string' ? lastName.trim().toLowerCase() : '';
  const yearCorr = typeof yearOfBirth === 'number' ? yearOfBirth : 0;
  const familyCorr = typeof requestsFamilyRanking === 'boolean' ? requestsFamilyRanking : false;
  const genderCorr = typeof gender === 'boolean' ? gender : false;
  const clubCorr = typeof isClubMember === 'boolean' ? isClubMember : false;
  const pzaCorr = typeof isPZAMember === 'boolean' ? isPZAMember : false;
  const clubNameCorr = typeof clubName === 'string' && clubName.length > 0 ? clubName : null;
  const startNumberCorr = typeof startNumber === 'number' ? startNumber : 0;
  const verifiedCorr = typeof verified === 'boolean' ? verified : false;
  const underageConsentCorr = typeof underageConsent === 'boolean' ? underageConsent : false;
  const hasPaidCorr = typeof hasPaid === 'boolean' ? hasPaid : false;
  if (
    !firstNameCorr.length
    || !lastNameCorr.length
    || !compIdCorr.length
    || !categoryIdCorr.length
    || yearCorr === 0
    || (userIdCorr !== null && !userIdCorr.length)
  ) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const userById = userIdCorr !== null ? await prisma.user.findUnique({ where: { id: userIdCorr } }) : null;
  if (userIdCorr !== null && !userById) {
    return Response.json({ message: 'Nieprawidłowy identyfikator użytkownika.' }, { status: 400 });
  }
  const comp = await prisma.competition.findUnique({ where: { id: compIdCorr } });
  if (!comp) {
    return Response.json({ message: 'Nieprawidłowy identyfikator zawodów.' }, { status: 400 });
  }
  const category = await prisma.category.findUnique({ where: { id: categoryIdCorr } });
  if (!category) {
    return Response.json({ message: 'Nieprawidłowy identyfikator kategorii.' }, { status: 400 });
  }
  if (userById) {
    // Sign up logged in
    try {
      const enrollRecordEx = await prisma.user_Competition.findFirst({ where: { competitionId: compIdCorr, userId: userById.id } });
      if (enrollRecordEx) {
        return Response.json({ message: 'Użytkownik jest już zapisany na wybrane zawody.' }, { status: 400 });
      }
      await prisma.user_Competition.create({
        data: {
          competitionId: compIdCorr,
          userId: userById.id,
          categoryId: categoryIdCorr,
          isPZAMember: pzaCorr,
          isClubMember: clubCorr,
          clubName: clubNameCorr,
          requestsFamilyRanking: familyCorr,
          startNumber: startNumberCorr,
          verified: verifiedCorr,
          underageConsent: underageConsentCorr,
          hasPaid: hasPaidCorr,
        },
      });
      return Response.json({ message: 'Użytkownik został pomyślnie zapisany na zawody.' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
    }
  }
  // sign-up no user Id
  try {
    const guestRole = await prisma.role.findFirst({ where: { authLevel: 0 } });
    const cEmail = tempEmail(firstNameCorr, lastNameCorr);
    const cUser = await prisma.user.findUnique({ where: { email: cEmail } });
    let cUserId = '';
    if (!cUser) {
      const child = await prisma.user.create({
        data: {
          email: cEmail,
          firstName: firstNameCorr,
          lastName: lastNameCorr,
          yearOfBirth: yearCorr,
          gender: genderCorr,
          isPZAMember: pzaCorr,
          isClubMember: clubCorr,
          clubName: clubNameCorr,
          roleId: guestRole?.id ?? '',
        },
      });
      cUserId = child.id;
    } else cUserId = cUser.id;
    const enrollRecordEx = await prisma.user_Competition.findFirst({ where: { competitionId: compIdCorr, userId: cUserId } });
    if (enrollRecordEx) {
      return Response.json({ message: 'Podana osoba jest już zapisana na wybrane zawody' }, { status: 400 });
    }
    await prisma.user_Competition.create({
      data: {
        competitionId: compIdCorr,
        userId: cUserId,
        categoryId: categoryIdCorr,
        isPZAMember: pzaCorr,
        isClubMember: clubCorr,
        clubName: clubNameCorr,
        requestsFamilyRanking: familyCorr,
        startNumber: startNumberCorr,
        verified: verifiedCorr,
        underageConsent: underageConsentCorr,
        hasPaid: hasPaidCorr,
      },
    });
    return Response.json({ message: 'Nowy użytkownik został pomyślnie zapisany na zawody.' }, { status: 200 });
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
    categoryId,
    clubName,
    isPZAMember,
    isClubMember,
    startNumber,
    verified,
    underageConsent,
    hasPaid,
    requestsFamilyRanking,
  } = await req.json();
  const idCorr = typeof id === 'string' ? id.trim() : '';
  const categoryIdCorr = typeof categoryId === 'string' ? categoryId.trim() : '';
  const familyCorr = typeof requestsFamilyRanking === 'boolean' ? requestsFamilyRanking : false;
  const clubCorr = typeof isClubMember === 'boolean' ? isClubMember : false;
  const pzaCorr = typeof isPZAMember === 'boolean' ? isPZAMember : false;
  const clubNameCorr = typeof clubName === 'string' && clubName.length > 0 ? clubName : null;
  const startNumberCorr = typeof startNumber === 'number' ? startNumber : 0;
  const verifiedCorr = typeof verified === 'boolean' ? verified : false;
  const underageConsentCorr = typeof underageConsent === 'boolean' ? underageConsent : false;
  const hasPaidCorr = typeof hasPaid === 'boolean' ? hasPaid : false;
  if (!idCorr.length || !categoryIdCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const enrollById = await prisma.user_Competition.findUnique({ where: { id: idCorr } });
  if (!enrollById) {
    return Response.json({ message: 'Nieprawidłowy identyfikator wpisu na zawody.' }, { status: 400 });
  }
  const category = await prisma.category.findUnique({ where: { id: categoryIdCorr } });
  if (!category) {
    return Response.json({ message: 'Nieprawidłowy identyfikator kategorii.' }, { status: 400 });
  }
  try {
    await prisma.user_Competition.update({
      where: { id: idCorr },
      data: {
        categoryId: categoryIdCorr,
        isPZAMember: pzaCorr,
        isClubMember: clubCorr,
        clubName: clubNameCorr,
        requestsFamilyRanking: familyCorr,
        startNumber: startNumberCorr,
        verified: verifiedCorr,
        underageConsent: underageConsentCorr,
        hasPaid: hasPaidCorr,
      },
    });
    return Response.json({ message: 'Wpis na zawody zaktualizowany pomyślnie.' }, { status: 200 });
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
  const enrollId = req.nextUrl.searchParams.get('id');
  if (enrollId === null || !enrollId.length) {
    return Response.json({ message: 'Brak identyfikatora wpisu.' }, { status: 400 });
  }
  const found = await prisma.user_Competition.findUnique({ where: { id: enrollId.trim() } });
  if (found === null) {
    return Response.json({ message: 'Nie znaleziono wpisu o podanym identyfikatorze.' }, { status: 400 });
  }
  try {
    await prisma.user_Competition.delete({ where: { id: enrollId.trim() } });
    return Response.json({ message: 'Wpis usunięty pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
