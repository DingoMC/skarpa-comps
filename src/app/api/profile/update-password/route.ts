import { decodeToken, verifyToken } from '@/lib/auth';
import { SALT_ROUNDS, USER_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, USER_AUTH_LEVEL);
  const decoded = decodeToken(token);
  const { oldPassword, newPassword } = await req.json();
  if (!ok || decoded === null) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.user.id.trim() } });
  if (!user || user.password === null) {
    return Response.json({ message: 'Nie znaleziono użytkownika o podanym identyfikatorze.' }, { status: 401 });
  }
  const newPasswordCorr = typeof newPassword === 'string' ? newPassword.trim() : '';
  const oldPasswordCorr = typeof oldPassword === 'string' ? oldPassword.trim() : '';
  if (!newPasswordCorr.length || !oldPasswordCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  const passOk = await bcrypt.compare(oldPasswordCorr, user.password);
  if (!passOk) {
    return Response.json({ message: 'Nieprawidłowe hasło.' }, { status: 401 });
  }
  const hashedPass = await bcrypt.hash(newPasswordCorr, SALT_ROUNDS);
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPass,
      },
    });
    return Response.json({ message: 'Hasło zostało zmienione.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
