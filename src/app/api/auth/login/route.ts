import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '@/lib/types/auth';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  if (token !== undefined && token !== null) {
    return Response.json({ message: 'Jesteś już zalogowany' }, { status: 400 });
  }
  const { email, password } = await req.json();
  const emailCorr = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const passwordCorr = typeof password === 'string' ? password.trim() : '';
  if (!emailCorr.length || !passwordCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
  }
  const foundUser = await prisma.user.findFirst({ where: { email: emailCorr }, include: { role: true } });
  if (foundUser === null || !foundUser.hasAccount || foundUser.password === null) {
    return Response.json({ message: 'Nieprawidłowy email lub hasło' }, { status: 401 });
  }
  const passOk = await bcrypt.compare(passwordCorr, foundUser.password);
  if (!passOk) {
    return Response.json({ message: 'Nieprawidłowy email lub hasło' }, { status: 401 });
  }
  const tokenPayload: TokenPayload = { user: foundUser, authLevel: foundUser.role.authLevel };
  const newToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });
  return Response.json({ user: tokenPayload.user, token: newToken, authLevel: tokenPayload.authLevel }, { status: 200 });
}
