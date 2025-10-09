export type TaskScoringSystem = 'zones' | 'linear' | 'ranges' | 'time' | 'multilinear';

export interface TaskZone {
  name: string;
  shortName: string;
  score: number;
}

export interface TaskLinearCoeff {
  a: number;
  b: number;
}

export interface TaskMultilinearCoeff {
  min: number;
  max: number;
  coeff: number;
}

export interface TaskRange {
  min: number;
  max: number;
  score: number;
}

export type TaskTimeAggType = 'best' | 'worst' | 'sum' | 'avg';
export type TaskTimeTransformType = 'linear' | 'hyperbolic' | 'ranges';

export interface TaskSettingsBase {
  maxAttempts: number | null;
  timeLimit: number | null;
}

export interface TaskSettingsZones extends TaskSettingsBase {
  scoringSystem: 'zones';
  zones: TaskZone[];
}

export interface TaskSettingsLinear extends TaskSettingsBase {
  scoringSystem: 'linear';
  linear: TaskLinearCoeff;
}

export interface TaskSettingsRanges extends TaskSettingsBase {
  scoringSystem: 'ranges';
  ranges: {
    data: TaskRange[];
    outOfMin: number;
    outOfMax: number;
  };
}

export interface TaskSettingsMultilinear extends TaskSettingsBase {
  scoringSystem: 'multilinear';
  multilinear: {
    b: number;
    data: TaskMultilinearCoeff[];
    outOfMin: number;
    outOfMax: number;
  };
}

export interface TaskSettingsTimeRanges {
  method: TaskTimeAggType;
  transform: 'ranges';
  ranges: {
    data: TaskRange[];
    outOfMin: number;
    outOfMax: number;
  };
}

export interface TaskSettingsTimeLinear {
  method: TaskTimeAggType;
  transform: 'linear';
  coeffs: TaskLinearCoeff;
}

export interface TaskSettingsTimeHyperbolic {
  method: TaskTimeAggType;
  transform: 'hyperbolic';
  coeffs: TaskLinearCoeff;
}

export interface TaskSettingsTime extends TaskSettingsBase {
  scoringSystem: 'time';
  time: TaskSettingsTimeRanges | TaskSettingsTimeLinear | TaskSettingsTimeHyperbolic;
}

export type TaskSettings = TaskSettingsZones | TaskSettingsLinear | TaskSettingsRanges | TaskSettingsMultilinear | TaskSettingsTime;

export interface TaskResult {
  attempts: {
    value?: number;
    zone?: { name: string; shortName: string; score: number };
  }[];
}
