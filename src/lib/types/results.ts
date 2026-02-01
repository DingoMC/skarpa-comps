import { Family, User_Competition } from "@prisma/client";
import { StartListEntry, UserUIMinimal } from "./startList";
import { TaskResult } from "./task";

export interface ResultsSummary extends User_Competition {
  user: UserUIMinimal;
  score: number;
  place: number | null;
  partial: { [key: string]: { score: number, data: TaskResult } };
}

export interface FamilyResultsPartial extends StartListEntry {
  score: number;
  included: boolean;
}

export interface FamilyResultsSummary extends Family {
  score: number;
  place: number;
  members: FamilyResultsPartial[];
}
