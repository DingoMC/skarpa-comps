'use client';

import { VERSION_COLORS, VERSION_NAMES } from '../constants';
import { Version } from '../types';

type Props = {
  version: Version;
  variant: 'badge' | 'text';
  classes?: string;
};

const AppVersion = ({ version, variant, classes }: Props) => {
  if (variant === 'badge') {
    return (
      <div
        className={`flex items-center justify-center text-xs border rounded-md px-2 py-[2px] w-fit ${classes ?? ''}`}
        style={{
          backgroundColor: VERSION_COLORS[version.versionType].background,
          color: VERSION_COLORS[version.versionType].text,
          borderColor: VERSION_COLORS[version.versionType].border,
        }}
      >
        {`${VERSION_NAMES[version.versionType]} ${version.version}`}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-sm w-fit ${classes ?? ''}`}
      style={{ color: VERSION_COLORS[version.versionType].text }}
    >
      {`${VERSION_NAMES[version.versionType]} ${version.version}`}
    </div>
  );
};

export default AppVersion;
