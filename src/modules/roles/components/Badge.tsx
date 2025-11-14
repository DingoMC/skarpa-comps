'use client';

import { ADMIN_AUTH_LEVEL, SUPER_ADMIN_AUTH_LEVEL, USER_AUTH_LEVEL } from '@/lib/constants';
import { Role } from '@prisma/client';
import { useMemo } from 'react';

type Props = {
  roles: Role[];
  roleId: string;
};

const commonClass = 'text-xs rounded-md px-1 py-[2px] border w-max';

const RoleBadge = ({ roles, roleId }: Props) => {
  const role = useMemo(() => roles.find((r) => r.id === roleId), [roles, roleId]);

  if (!role) return null;

  if (role.authLevel >= SUPER_ADMIN_AUTH_LEVEL) {
    return <div className={`${commonClass} text-skarpa-800 border-skarpa-800 bg-skarpa-50`}>Super</div>;
  }

  if (role.authLevel >= ADMIN_AUTH_LEVEL) {
    return <div className={`${commonClass} text-purple-800 border-purple-800 bg-purple-50`}>Admin</div>;
  }

  if (role.authLevel >= USER_AUTH_LEVEL) {
    return <div className={`${commonClass} text-green-800 border-green-800 bg-green-50`}>User</div>;
  }

  return <div className={`${commonClass} text-gray-800 border-gray-800 bg-gray-50`}>Guest</div>;
};

export default RoleBadge;
