import { Family } from "@prisma/client";

export interface AdminFamily extends Family {
  userFamilies: { userCompId: string }[];
}
