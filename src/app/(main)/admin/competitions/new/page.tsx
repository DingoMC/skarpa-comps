import { siteMap } from '@/lib/siteMap';
import NewCompetitionWrapper from '@/modules/admin/competitions/wrappers/NewCompetitionWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.competitions.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <NewCompetitionWrapper />;

export default Page;
