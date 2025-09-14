import { User } from "@prisma/client";

export interface TokenPayload {
  user: Omit<User, 'password'>,
  authLevel: number,
}
