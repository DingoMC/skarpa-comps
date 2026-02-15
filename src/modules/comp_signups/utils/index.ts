import { UserUI } from '@/lib/types/auth';
import { Category } from '@prisma/client';

export const autoAssignCategoryId = (user: UserUI | null, categories: Category[]) => {
  if (user === null) return '';
  const year = user.yearOfBirth;
  for (const c of categories) {
    if ((c.maxAge ?? 32767) <= year && (c.minAge ?? -1) >= year) return c.id;
  }
  return '';
};

export const autoAssignCategoryByAge = (yearOfBirth: number, categories: Category[]) => {
  const year = yearOfBirth;
  for (const c of categories) {
    if ((c.maxAge ?? 32767) <= year && (c.minAge ?? -1) >= year) return c.id;
  }
  return '';
};
