export interface EnrollRequest {
  competitionId: string;
  email: string;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  gender: boolean;
  password: string | null;
  userId: string | null;
  categoryId: string;
  clubName: string | null;
  enrollAsChild: boolean;
  isPZAMember: boolean;
  isClubMember: boolean;
  requestsFamilyRanking: boolean;
}
