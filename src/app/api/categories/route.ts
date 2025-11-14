import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.category.findMany({ orderBy: { seq: 'asc' } });
  return Response.json(data, { status: 200 });
}
