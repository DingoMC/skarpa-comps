import { UserUI } from '@/lib/types/auth';
import { Category } from '@prisma/client';

export const autoAssignCategoryId = (user: UserUI | null, categories: Category[]) => {
  if (user === null) return '';
  const age = new Date().getFullYear() - user.yearOfBirth;
  for (const c of categories) {
    if ((c.maxAge ?? 32767) >= age && (c.minAge ?? -1) <= age) return c.id;
  }
  return '';
};

export const autoAssignCategoryByAge = (yearOfBirth: number, categories: Category[]) => {
  const age = new Date().getFullYear() - yearOfBirth;
  for (const c of categories) {
    if ((c.maxAge ?? 32767) >= age && (c.minAge ?? -1) <= age) return c.id;
  }
  return '';
};
