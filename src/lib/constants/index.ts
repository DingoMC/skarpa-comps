import { Category, Competition, User } from '@prisma/client';
import { FamilySettings } from '../types/competition';
import { EnrollRequest } from '../types/enroll';

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

export const EMPTY_ENROLL: EnrollRequest = {
  email: '',
  firstName: '',
  lastName: '',
  yearOfBirth: 2000,
  gender: false,
  password: null,
  isPZAMember: false,
  isClubMember: false,
  clubName: null,
  competitionId: '',
  userId: null,
  categoryId: '',
  enrollAsChild: false,
  requestsFamilyRanking: false,
};

export const EMPTY_CATGEORY: Category = {
  name: '',
  id: '',
  seq: 0,
  minAge: null,
  maxAge: null,
};

export const EMPTY_COMPETITION: Competition = {
  id: '',
  name: '',
  description: null,
  lockResults: false,
  lockEnroll: false,
  isInternal: false,
  familySettings: null,
  pzaSettings: null,
  selfScoringSettings: null,
  allowFamilyRanking: false,
  clubMembersPay: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  startDate: new Date(),
  endDate: new Date(),
  enrollStart: new Date(),
  enrollEnd: new Date(),
};

export const EMPTY_FAMILY_SETTINGS: FamilySettings = {
  include: 'all',
  includePZAMembers: false,
  pzaFilterCategories: [],
  aggregation: 'sum',
};

export const SALT_ROUNDS = 10;

export const SUPER_ADMIN_AUTH_LEVEL = 100;
export const ADMIN_AUTH_LEVEL = 10;
export const USER_AUTH_LEVEL = 1;
export const GUEST_AUTH_LEVEL = 0;
