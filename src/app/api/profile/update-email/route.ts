import { decodeToken, verifyToken } from '@/lib/auth';
import { USER_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, USER_AUTH_LEVEL);
  const decoded = decodeToken(token);
  const { email } = await req.json();
  if (!ok || decoded === null) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.user.id.trim() }, omit: { password: true } });
  if (!user) {
    return Response.json({ message: 'Nie znaleziono użytkownika o podanym identyfikatorze.' }, { status: 401 });
  }
  const emailCorr = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!emailCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const userExists = await prisma.user.findUnique({ where: { email: emailCorr } });
  if (userExists) {
    return Response.json({ message: 'Ten adres e-mail jest już zajęty.' }, { status: 400 });
  }
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: emailCorr,
      },
    });
    return Response.json({ message: 'Adres E-mail został zmieniony.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
