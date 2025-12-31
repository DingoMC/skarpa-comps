import { User_Competition } from '@prisma/client';
import { UserUI } from './auth';

export type UserUIMinimal = {
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  gender: boolean;
  roleId: string;
};

export interface StartListEntry extends User_Competition {
  user: UserUIMinimal;
}

export interface StartListAdmin extends User_Competition {
  user: UserUI;
}
