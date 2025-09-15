import { User } from '@prisma/client';

export type UserUI = Omit<User, 'password'>;

export interface TokenPayload {
  user: UserUI;
  authLevel: number;
}
