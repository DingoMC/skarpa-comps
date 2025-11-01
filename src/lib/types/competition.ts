export interface FamilySettingsBase {
  includePZAMembers: boolean;
  pzaFilterCategories: string[] | null; // array of Category IDs
  aggregation: 'sum' | 'best' | 'avg';
}

export interface FamilySettingsIncludeAll extends FamilySettingsBase {
  include: 'all';
}

export interface FamilySettingsIncludeTopN extends FamilySettingsBase {
  include: 'topN';
  topN: number;
}

export type FamilySettings = FamilySettingsIncludeAll | FamilySettingsIncludeTopN;

export interface PZASettings {
  pzaTakesPlaces: boolean;
  pzaFilterCategories: string[] | null; // array of Category IDs
}

export interface SelfScoringCategorySettings {
  categoryId: string;
  modifyAfterSent: boolean;
  selfScoringFrom?: number;
  selfScoringTo?: number;
}

export interface SelfScoringSettings {
  allowSelfScoring: boolean;
  settings: SelfScoringCategorySettings[];
}
