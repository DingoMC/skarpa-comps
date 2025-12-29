import prisma from '@/lib/prisma';

export async function GET() {
  const roles = await prisma.role.findMany({ orderBy: { authLevel: 'asc' } });
  return Response.json(roles, { status: 200 });
}
