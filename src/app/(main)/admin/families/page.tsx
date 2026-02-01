import { siteMap } from '@/lib/siteMap';
import AdminFamiliesWrapper from '@/modules/admin/families/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.families.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <AdminFamiliesWrapper />;

export default Page;
