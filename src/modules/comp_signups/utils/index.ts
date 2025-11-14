import { UserUI } from '@/lib/types/auth';
import { Category } from '@prisma/client';

const MAX_AGE_FALLBACK = 32767;
const MIN_AGE_FALLBACK = -1;

export const autoAssignCategoryId = (user: UserUI | null, categories: Category[]) => {
  if (user === null) return '';
  const age = new Date().getFullYear() - user.yearOfBirth;
  for (const c of categories) {
    if ((c.maxAge ?? MAX_AGE_FALLBACK) >= age && (c.minAge ?? MIN_AGE_FALLBACK) <= age) return c.id;
  }
  return '';
};

export const autoAssignCategoryByAge = (yearOfBirth: number, categories: Category[]) => {
  const age = new Date().getFullYear() - yearOfBirth;
  for (const c of categories) {
    if ((c.maxAge ?? MAX_AGE_FALLBACK) >= age && (c.minAge ?? MIN_AGE_FALLBACK) <= age) return c.id;
  }
  return '';
};
