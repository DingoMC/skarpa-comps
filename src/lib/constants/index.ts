import { Category, Competition, Task, User } from '@prisma/client';
import { FamilySettings } from '../types/competition';
import { EnrollCreateAdmin, EnrollReNumberReq, EnrollRequest } from '../types/enroll';
import { TaskSettings } from '../types/task';

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
  withAccount: false,
  requestsFamilyRanking: false,
};

export const EMPTY_CATGEORY: Category = {
  name: '',
  id: '',
  seq: 0,
  minAge: null,
  maxAge: null,
  competitionId: null,
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

export const DEFAULT_TASK_SETTINGS: TaskSettings = {
  scoringSystem: 'normal',
  maxAttempts: null,
  timeLimit: null,
};

export const EMPTY_TASK: Task = {
  name: '',
  id: '',
  type: 'route',
  shortName: '',
  settings: JSON.stringify(DEFAULT_TASK_SETTINGS),
  competitionId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const EMPTY_FAMILY_SETTINGS: FamilySettings = {
  include: 'all',
  includePZAMembers: false,
  pzaFilterCategories: [],
  aggregation: 'sum',
};

export const EMPTY_ENROLL_CREATE: EnrollCreateAdmin = {
  competitionId: '',
  firstName: '',
  lastName: '',
  yearOfBirth: 2000,
  gender: false,
  userId: null,
  categoryId: '',
  clubName: null,
  startNumber: null,
  isPZAMember: false,
  isClubMember: false,
  requestsFamilyRanking: false,
  verified: false,
  underageConsent: false,
  hasPaid: false,
};

export const EMPTY_ENROLL_RENUMBER: EnrollReNumberReq = {
  startNumber: 1,
  orderBy: 'random',
  group: true,
  safetyGap: 5,
  nextFromMultipleOf: 10,
};

export const SALT_ROUNDS = 10;

export const SUPER_ADMIN_AUTH_LEVEL = 100;
export const ADMIN_AUTH_LEVEL = 10;
export const USER_AUTH_LEVEL = 1;
export const GUEST_AUTH_LEVEL = 0;
