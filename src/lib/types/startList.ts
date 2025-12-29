import { User_Competition } from '@prisma/client';

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
