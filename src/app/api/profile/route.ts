import { decodeToken, verifyToken } from '@/lib/auth';
import { USER_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, USER_AUTH_LEVEL);
  const decoded = decodeToken(token);
  if (!ok || decoded === null) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.user.id.trim() }, omit: { password: true } });
  if (!user) {
    return Response.json({ message: 'Nie znaleziono użytkownika o podanym identyfikatorze.' }, { status: 401 });
  }
  return Response.json({ ...user }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, USER_AUTH_LEVEL);
  const decoded = decodeToken(token);
  const { firstName, lastName, yearOfBirth, gender, clubName, isPZAMember, isClubMember } = await req.json();
  if (!ok || decoded === null) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.user.id.trim() }, omit: { password: true } });
  if (!user) {
    return Response.json({ message: 'Nie znaleziono użytkownika o podanym identyfikatorze.' }, { status: 401 });
  }
  const firstNameCorr = typeof firstName === 'string' ? firstName.trim().toLowerCase() : '';
  const lastNameCorr = typeof lastName === 'string' ? lastName.trim().toLowerCase() : '';
  const yearCorr = typeof yearOfBirth === 'number' ? yearOfBirth : 0;
  const genderCorr = typeof gender === 'boolean' ? gender : false;
  const clubCorr = typeof isClubMember === 'boolean' ? isClubMember : false;
  const pzaCorr = typeof isPZAMember === 'boolean' ? isPZAMember : false;
  const clubNameCorr = typeof clubName === 'string' && clubName.length > 0 ? clubName : null;
  if (!firstNameCorr.length || !lastNameCorr.length || yearCorr === 0) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
  }
  try {
    const newUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstNameCorr,
        lastName: lastNameCorr,
        yearOfBirth: yearCorr,
        gender: genderCorr,
        isClubMember: clubCorr,
        isPZAMember: pzaCorr,
        clubName: clubNameCorr,
      },
      omit: { password: true },
    });
    return Response.json({ ...newUser }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
