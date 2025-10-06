import { verifyToken, verifyTokenAuthLevel } from '@/lib/auth';
import { ADMIN_AUTH_LEVEL, GUEST_AUTH_LEVEL, SALT_ROUNDS, USER_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const userId = req.nextUrl.searchParams.get('id');
  if (userId !== null && userId.length) {
    const foundUser = await prisma.user.findUnique({ where: { id: userId.trim() }, omit: { password: true } });
    if (foundUser === null) {
      return Response.json({ message: 'Nie znaleziono użytkownika o podanym identyfikatorze.' }, { status: 400 });
    }
    return Response.json(foundUser, { status: 200 });
  }
  const users = await prisma.user.findMany({ omit: { password: true }, orderBy: { createdAt: 'desc' } });
  return Response.json(users, { status: 200 });
}

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const { firstName, lastName, email, password, gender, isClubMember, isPZAMember, yearOfBirth, roleId } = await req.json();
  const firstNameCorr = typeof firstName === 'string' ? firstName.trim().toLowerCase() : '';
  const lastNameCorr = typeof lastName === 'string' ? lastName.trim().toLowerCase() : '';
  const emailCorr = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const passwordCorr = typeof password === 'string' ? password.trim() : '';
  const yearCorr = typeof yearOfBirth === 'number' ? yearOfBirth : 0;
  const genderCorr = typeof gender === 'boolean' ? gender : false;
  const clubCorr = typeof isClubMember === 'boolean' ? isClubMember : false;
  const pzaCorr = typeof isPZAMember === 'boolean' ? isPZAMember : false;
  const roleIdCorr = typeof roleId === 'string' ? roleId : '';
  if (!firstNameCorr.length || !lastNameCorr.length || !emailCorr.length || yearCorr === 0) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const hashedPass = await bcrypt.hash(passwordCorr, SALT_ROUNDS);
  // Check if user with that email exists in db
  const sameEmailUser = await prisma.user.findFirst({
    where: {
      email: emailCorr,
    },
  });
  if (sameEmailUser !== null && sameEmailUser.hasAccount && sameEmailUser.password !== null) {
    return Response.json({ message: 'Użytkownik o podanym adresie email już istnieje.' }, { status: 400 });
  }
  const role = await prisma.role.findUnique({ where: { id: roleIdCorr } });
  if (role === null) {
    return Response.json({ message: 'Nieprawidłowy identyfikator roli użytkownika.' }, { status: 400 });
  }
  const roleOk = await verifyTokenAuthLevel(role.authLevel, token);
  if (!roleOk) {
    return Response.json({ message: 'Nie masz uprawnień aby nadać tę rolę użytkownikowi.' }, { status: 403 });
  }
  if (role.authLevel >= USER_AUTH_LEVEL && !passwordCorr.length) {
    return Response.json({ message: 'Brak ustawionego hasła.' }, { status: 400 });
  }
  try {
    await prisma.user.create({
      data: {
        email: emailCorr,
        firstName: firstNameCorr,
        lastName: lastNameCorr,
        password: role.authLevel >= USER_AUTH_LEVEL ? hashedPass : null,
        hasAccount: role.authLevel >= USER_AUTH_LEVEL,
        yearOfBirth: yearCorr,
        gender: genderCorr,
        isClubMember: clubCorr,
        isPZAMember: pzaCorr,
        roleId: role.id,
      },
    });
    return Response.json({ message: 'Uzytkownik utworzony pomyślnie.' }, { status: 200 });
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
  const { id, firstName, lastName, gender, isClubMember, isPZAMember, yearOfBirth, roleId } = await req.json();
  const firstNameCorr = typeof firstName === 'string' ? firstName.trim().toLowerCase() : '';
  const lastNameCorr = typeof lastName === 'string' ? lastName.trim().toLowerCase() : '';
  const idCorr = typeof id === 'string' ? id.trim() : '';
  const yearCorr = typeof yearOfBirth === 'number' ? yearOfBirth : 0;
  const genderCorr = typeof gender === 'boolean' ? gender : false;
  const clubCorr = typeof isClubMember === 'boolean' ? isClubMember : false;
  const pzaCorr = typeof isPZAMember === 'boolean' ? isPZAMember : false;
  const roleIdCorr = typeof roleId === 'string' ? roleId : '';
  if (!firstNameCorr.length || !lastNameCorr.length || !idCorr.length || yearCorr === 0) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  // Check if user exists in db
  const foundUser = await prisma.user.findUnique({
    where: {
      id: idCorr,
    },
    include: {
      role: true,
    },
  });
  if (foundUser === null) {
    return Response.json({ message: 'Użytkownik o podanym identyfikatorze nie istnieje.' }, { status: 400 });
  }
  const role = await prisma.role.findUnique({ where: { id: roleIdCorr } });
  if (role === null) {
    return Response.json({ message: 'Nieprawidłowy identyfikator roli użytkownika.' }, { status: 400 });
  }
  const initRoleOk = await verifyTokenAuthLevel(foundUser.role.authLevel, token);
  if (!initRoleOk) {
    return Response.json({ message: 'Nie masz uprawnień aby modyfikować tego użytkownika.' }, { status: 403 });
  }
  const roleOk = await verifyTokenAuthLevel(role.authLevel, token);
  if (!roleOk) {
    return Response.json({ message: 'Nie masz uprawnień aby nadać tę rolę użytkownikowi.' }, { status: 403 });
  }
  try {
    await prisma.user.update({
      where: {
        id: idCorr,
      },
      data: {
        firstName: firstNameCorr,
        lastName: lastNameCorr,
        yearOfBirth: yearCorr,
        gender: genderCorr,
        isClubMember: clubCorr,
        isPZAMember: pzaCorr,
        password: role.authLevel === GUEST_AUTH_LEVEL ? null : undefined,
        hasAccount: role.authLevel >= USER_AUTH_LEVEL,
        roleId: role.id,
      },
    });
    return Response.json({ message: 'Uzytkownik utworzony pomyślnie.' }, { status: 200 });
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
  const userId = req.nextUrl.searchParams.get('id');
  if (userId === null || !userId.length) {
    return Response.json({ message: 'Brak identyfikatora użytkownika.' }, { status: 400 });
  }
  const foundUser = await prisma.user.findUnique({ where: { id: userId.trim() }, include: { role: true } });
  if (foundUser === null) {
    return Response.json({ message: 'Nie znaleziono użytkownika o podanym identyfikatorze.' }, { status: 400 });
  }
  const roleOk = await verifyTokenAuthLevel(foundUser.role.authLevel, token);
  if (!roleOk) {
    return Response.json({ message: 'Nie masz uprawnień aby usunąć tego użytkownika.' }, { status: 403 });
  }
  try {
    await prisma.user.delete({ where: { id: userId.trim() } });
    return Response.json({ message: 'Uzytkownik usunięty pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
