'use client';

import { siteMapByPath } from '@/lib/siteMap';
import { usePathname } from 'next/navigation';
import CompetitionSelectorWrapper from '.';

const CompetitionSelectorGateway = () => {
  const path = usePathname();
  const page = siteMapByPath.get(path);

  if (!page.competitionSelector) return null;

  return <CompetitionSelectorWrapper />;
};

export default CompetitionSelectorGateway;
