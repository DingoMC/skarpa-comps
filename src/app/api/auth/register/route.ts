import { SALT_ROUNDS } from '@/lib/constants';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  if (token !== undefined && token !== null) {
    return Response.json({ message: 'Jesteś już zalogowany' }, { status: 400 });
  }
  const { firstName, lastName, email, password, gender, clubName, isClubMember, isPZAMember, yearOfBirth } = await req.json();
  const firstNameCorr = typeof firstName === 'string' ? firstName.trim().toLowerCase() : '';
  const lastNameCorr = typeof lastName === 'string' ? lastName.trim().toLowerCase() : '';
  const emailCorr = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const passwordCorr = typeof password === 'string' ? password.trim() : '';
  const yearCorr = typeof yearOfBirth === 'number' ? yearOfBirth : 0;
  const genderCorr = typeof gender === 'boolean' ? gender : false;
  const clubCorr = typeof isClubMember === 'boolean' ? isClubMember : false;
  const pzaCorr = typeof isPZAMember === 'boolean' ? isPZAMember : false;
  const clubNameCorr = typeof clubName === 'string' && clubName.length > 0 ? clubName : null;
  if (!firstNameCorr.length || !lastNameCorr.length || !emailCorr.length || !passwordCorr.length || yearCorr === 0) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
  }
  const hashedPass = await bcrypt.hash(passwordCorr, SALT_ROUNDS);
  // Check if user with that email exists in db
  const sameEmailUser = await prisma.user.findFirst({
    where: {
      email: emailCorr,
    },
  });
  if (sameEmailUser !== null && sameEmailUser.hasAccount && sameEmailUser.password !== null) {
    return Response.json({ message: 'Użytkownik o podanym adresie email juz istnieje.' }, { status: 400 });
  }
  try {
    const userRole = await prisma.role.findFirst({ where: { authLevel: 1 } });
    if (userRole === null) {
      return Response.json({ message: 'Zarejestrowano pomyślnie.' }, { status: 200 });
    }
    if (sameEmailUser !== null) {
      await prisma.user.update({
        where: { email: emailCorr },
        data: {
          firstName: firstNameCorr,
          lastName: lastNameCorr,
          password: hashedPass,
          hasAccount: true,
          yearOfBirth: yearCorr,
          gender: genderCorr,
          clubName: clubNameCorr,
          isClubMember: clubCorr,
          isPZAMember: pzaCorr,
          roleId: userRole.id,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          email: emailCorr,
          firstName: firstNameCorr,
          lastName: lastNameCorr,
          password: hashedPass,
          hasAccount: true,
          clubName: clubNameCorr,
          yearOfBirth: yearCorr,
          gender: genderCorr,
          isClubMember: clubCorr,
          isPZAMember: pzaCorr,
          roleId: userRole.id,
        },
      });
    }
    return Response.json({ message: 'Zarejestrowano pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
