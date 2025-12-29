import { verifyToken } from '@/lib/auth';
import { ADMIN_AUTH_LEVEL } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { getCookie } from 'cookies-next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const data = await prisma.taskScoringTemplate.findMany();
  return Response.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const token = await getCookie('token', { req });
  const ok = await verifyToken(token, ADMIN_AUTH_LEVEL);
  if (!ok) {
    return Response.json({ message: 'Odmowa dostępu.' }, { status: 401 });
  }
  const { name, settings } = await req.json();
  const nameCorr = typeof name === 'string' ? name.trim() : '';
  const settingsCorr = typeof settings === 'string' ? settings.trim() : '';
  if (!nameCorr.length || !settingsCorr.length) {
    return Response.json({ message: 'Nieprawidłowe dane wejściowe.' }, { status: 400 });
  }
  try {
    await prisma.taskScoringTemplate.create({
      data: {
        name: nameCorr,
        settings: settingsCorr,
      },
    });
    return Response.json({ message: 'Szablon utworzony pomyślnie.' }, { status: 200 });
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
  const templId = req.nextUrl.searchParams.get('id');
  if (templId === null || !templId.length) {
    return Response.json({ message: 'Brak identyfikatora szablonu.' }, { status: 400 });
  }
  const found = await prisma.taskScoringTemplate.findUnique({ where: { id: templId.trim() } });
  if (found === null) {
    return Response.json({ message: 'Nie znaleziono szablonu o podanym identyfikatorze.' }, { status: 400 });
  }
  try {
    await prisma.taskScoringTemplate.delete({ where: { id: templId.trim() } });
    return Response.json({ message: 'Szablon usunięty pomyślnie.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
