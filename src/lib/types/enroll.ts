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
  withAccount: boolean;
  isPZAMember: boolean;
  isClubMember: boolean;
  requestsFamilyRanking: boolean;
}

export interface EnrollCreateAdmin {
  competitionId: string;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  gender: boolean;
  userId: string | null;
  categoryId: string;
  clubName: string | null;
  startNumber: number | null;
  isPZAMember: boolean;
  isClubMember: boolean;
  requestsFamilyRanking: boolean;
  verified: boolean;
  underageConsent: boolean;
  hasPaid: boolean;
}

export interface EnrollUpdateAdmin {
  id: string;
  categoryId: string;
  clubName: string | null;
  startNumber: number | null;
  isPZAMember: boolean;
  isClubMember: boolean;
  requestsFamilyRanking: boolean;
  verified: boolean;
  underageConsent: boolean;
  hasPaid: boolean;
}
