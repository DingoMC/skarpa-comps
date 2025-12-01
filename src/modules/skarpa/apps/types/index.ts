export type VersionType = 'alpha' | 'beta' | 'pre-release' | 'release';
export type LogType = 'add' | 'remove' | 'fix' | 'change';

export interface Version {
  version: string;
  versionType: VersionType;
}

export interface Bug {
  id: number;
  fixed: boolean;
  description: string;
  from: Version;
  to?: Version;
}

export interface Log {
  type: LogType;
  content: string;
}

export interface Changelog {
  version: string;
  versionType: VersionType;
  log: Log[];
}

export interface MobileApp {
  name: string;
  version: string;
  versionType: VersionType;
  appPrefix: string;
  appCode: string;
  description: string;
  buglist: Bug[];
  changelog: Changelog[];
}
