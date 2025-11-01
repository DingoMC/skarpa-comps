import { decodeToken, verifyToken } from '@/lib/auth';
import { SALT_ROUNDS } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { childEmail } from '@/lib/text';
import bcrypt from 'bcrypt';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  const tokenOk = await verifyToken(token);
  const decoded = decodeToken(token);
  const {
    competitionId,
    email,
    firstName,
    lastName,
    yearOfBirth,
    gender,
    password,
    userId,
    categoryId,
    clubName,
    enrollAsChild,
    isPZAMember,
    isClubMember,
    requestsFamilyRanking,
  } = await req.json();
  const compIdCorr = typeof competitionId === 'string' ? competitionId.trim() : '';
  const categoryIdCorr = typeof categoryId === 'string' ? categoryId.trim() : '';
  const userIdCorr = typeof userId === 'string' ? userId.trim() : null;
  const firstNameCorr = typeof firstName === 'string' ? firstName.trim().toLowerCase() : '';
  const lastNameCorr = typeof lastName === 'string' ? lastName.trim().toLowerCase() : '';
  const emailCorr = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const passwordCorr = typeof password === 'string' ? password.trim() : null;
  const yearCorr = typeof yearOfBirth === 'number' ? yearOfBirth : 0;
  const asChildCorr = typeof enrollAsChild === 'boolean' ? enrollAsChild : false;
  const familyCorr = typeof requestsFamilyRanking === 'boolean' ? requestsFamilyRanking : false;
  const genderCorr = typeof gender === 'boolean' ? gender : false;
  const clubCorr = typeof isClubMember === 'boolean' ? isClubMember : false;
  const pzaCorr = typeof isPZAMember === 'boolean' ? isPZAMember : false;
  const clubNameCorr = typeof clubName === 'string' && clubName.length > 0 ? clubName : null;
  if (!firstNameCorr.length || !lastNameCorr.length || !emailCorr.length || !compIdCorr.length || categoryIdCorr.length || yearCorr === 0) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
  }
  if (tokenOk && userIdCorr !== null && decoded?.user.id !== userIdCorr) {
    return Response.json({ message: 'Nieprawidłowy identyfikator użytkownika' }, { status: 400 });
  }
  const comp = await prisma.competition.findUnique({ where: { id: compIdCorr } });
  if (!comp) {
    return Response.json({ message: 'Nieprawidłowy identyfikator zawodów' }, { status: 400 });
  }
  const now = Date.now();
  if (
    comp.lockEnroll
    || (!tokenOk && comp.isInternal)
    || new Date(comp.endDate).getTime() < now
    || new Date(comp.startDate).getTime() > now
  ) {
    return Response.json({ message: 'Nie możesz zapisać się na te zawody' }, { status: 403 });
  }
  const category = await prisma.category.findUnique({ where: { id: categoryIdCorr } });
  if (!category) {
    return Response.json({ message: 'Nieprawidłowy identyfikator kategorii' }, { status: 400 });
  }
  // User is logged in
  const userById = decoded !== null ? await prisma.user.findUnique({ where: { id: decoded.user.id } }) : null;
  // User exists under that email
  const userByEmail = await prisma.user.findUnique({ where: { email: emailCorr } });
  if (userById) {
    // If internal comps but not club member, disallow enroll
    if (comp.isInternal && !userById.isClubMember) {
      return Response.json({ message: 'Nie możesz zapisać się na te zawody' }, { status: 403 });
    }
    // Logged in user registers a child
    if (asChildCorr) {
      try {
        const childRole = await prisma.role.findFirst({ where: { authLevel: 0 } });
        const cEmail = childEmail(userById.email, firstNameCorr, lastNameCorr);
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
              roleId: childRole?.id ?? '',
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
          },
        });
        return Response.json({ message: 'Zapisano pomyślnie.' }, { status: 200 });
      } catch (error) {
        console.error(error);
        return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
      }
    }
    // Not as a child, as himself
    try {
      const enrollRecordEx = await prisma.user_Competition.findFirst({ where: { competitionId: compIdCorr, userId: userById.id } });
      if (enrollRecordEx) {
        return Response.json({ message: 'Jesteś już zapisany na wybrane zawody' }, { status: 400 });
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
        },
      });
      return Response.json({ message: 'Zapisano pomyślnie.' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
    }
  }
  if (userByEmail !== null && userByEmail.hasAccount) {
    return Response.json({ message: 'Pod podanym adresem email istnieje już konto. Zaloguj się aby się zapisać.' }, { status: 403 });
  }
  // Unregistered user registers a child
  if (asChildCorr) {
    try {
      const childRole = await prisma.role.findFirst({ where: { authLevel: 0 } });
      const cEmail = childEmail(emailCorr, firstNameCorr, lastNameCorr);
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
            roleId: childRole?.id ?? '',
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
        },
      });
      return Response.json({ message: 'Zapisano pomyślnie.' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
    }
  }
  // Unregistered, registers as himself
  try {
    const guestRole = await prisma.role.findFirst({ where: { authLevel: 0 } });
    const userRole = await prisma.role.findFirst({ where: { authLevel: 1 } });
    let uid = '';
    if (!userByEmail) {
      const u = await prisma.user.create({
        data: {
          email: emailCorr,
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
      uid = u.id;
    } else uid = userByEmail.id;
    const enrollRecordEx = await prisma.user_Competition.findFirst({ where: { competitionId: compIdCorr, userId: uid } });
    if (enrollRecordEx) {
      return Response.json({ message: 'Podana osoba jest już zapisana na wybrane zawody' }, { status: 400 });
    }
    await prisma.user_Competition.create({
      data: {
        competitionId: compIdCorr,
        userId: uid,
        categoryId: categoryIdCorr,
        isPZAMember: pzaCorr,
        isClubMember: clubCorr,
        clubName: clubNameCorr,
        requestsFamilyRanking: familyCorr,
      },
    });
    if (passwordCorr !== null) {
      const hashedPass = await bcrypt.hash(passwordCorr, SALT_ROUNDS);
      await prisma.user.update({ where: { id: uid }, data: { roleId: userRole?.id ?? '', password: hashedPass, hasAccount: true } });
      return Response.json({ message: 'Zapisano i zarejestrowano pomyślnie.' }, { status: 200 });
    }
    return Response.json({ message: 'Zapisano pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
