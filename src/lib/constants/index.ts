import { User } from '@prisma/client';

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
};

export const SALT_ROUNDS = 10;
