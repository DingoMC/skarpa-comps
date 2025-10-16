import { Category, User } from '@prisma/client';

export const EMPTY_USER: User = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  yearOfBirth: 2000,
  gender: false,
  hasAccount: false,
  password: null,
  roleId: '',
  isPZAMember: false,
  isClubMember: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  clubName: null,
};

export const EMPTY_CATGEORY: Category = {
  name: '',
  id: '',
  seq: 0,
  minAge: null,
  maxAge: null,
};

export const SALT_ROUNDS = 10;

export const SUPER_ADMIN_AUTH_LEVEL = 100;
export const ADMIN_AUTH_LEVEL = 10;
export const USER_AUTH_LEVEL = 1;
export const GUEST_AUTH_LEVEL = 0;
