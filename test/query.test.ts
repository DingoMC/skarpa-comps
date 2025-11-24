import { PrismaQueryBuilder } from '@/lib/query';
import { Role, User } from '@prisma/client';

test('Test Where Clause', () => {
  const q1 = new PrismaQueryBuilder<Role>().where('id', 17).build();
  expect(q1).toEqual({ where: { id: 17 } });
  const q2 = new PrismaQueryBuilder<Role>().where('id', 17).where('name', 'admin').build();
  expect(q2).toEqual({ where: { id: 17, name: 'admin' } });
});

test('Test Where...In Clause', () => {
  const q1 = new PrismaQueryBuilder<Role>().whereIn('id', [17, 18, 19]).build();
  expect(q1).toEqual({ where: { id: { in: [17, 18, 19] } } });
  const q2 = new PrismaQueryBuilder<Role>().whereIn('id', [17, 18, 19]).whereIn('name', ['admin', 'super_admin']).build();
  expect(q2).toEqual({ where: { id: { in: [17, 18, 19] }, name: { in: ['admin', 'super_admin'] } } });
});

test('Test Order By Clause', () => {
  const q1 = new PrismaQueryBuilder<Role>().orderBy('id', 'asc').build();
  expect(q1).toEqual({ orderBy: { id: 'asc' } });
  const q2 = new PrismaQueryBuilder<Role>().orderBy('name', 'desc').build();
  expect(q2).toEqual({ orderBy: { name: 'desc' } });
});

test('Test Include', () => {
  const q1 = new PrismaQueryBuilder<Role>().include(['name', 'description']).build();
  expect(q1).toEqual({ include: { name: true, description: true } });
  const q2 = new PrismaQueryBuilder<Role>().include([]).build();
  expect(q2).toEqual({ include: {} });
});

test('Test Combined', () => {
  const query = new PrismaQueryBuilder<User>().omit('password').orderBy('createdAt', 'desc').build();
  expect(query).toEqual({ omit: { password: true }, orderBy: { createdAt: 'desc' } });
});
