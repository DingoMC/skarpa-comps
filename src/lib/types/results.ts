import { User_Competition } from "@prisma/client";
import { UserUIMinimal } from "./startList";
import { TaskResult } from "./task";

export interface ResultsSummary extends User_Competition {
  user: UserUIMinimal;
  score: number;
  place: number | null;
  partial: { [key: string]: { score: number, data: TaskResult } };
}
