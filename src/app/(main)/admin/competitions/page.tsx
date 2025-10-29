import { siteMap } from '@/lib/siteMap';
import AdminCompetitionsWrapper from '@/modules/admin/competitions/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.competitions.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <AdminCompetitionsWrapper />;

export default Page;
