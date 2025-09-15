import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.headers.get('Next-Internal-API') !== '1') return Response.json({ message: 'Not internal' }, { status: 400 });
  const userId = req.nextUrl.searchParams.get('userId');
  if (userId === null || !userId.length) {
    return Response.json({ message: 'User not found' }, { status: 400 });
  }
  const userFound = await prisma.user.findUnique({ where: { id: userId.trim() } });
  if (userFound === null) {
    return Response.json({ message: 'User not found' }, { status: 400 });
  }
  return Response.json({ message: 'OK' }, { status: 200 });
}
