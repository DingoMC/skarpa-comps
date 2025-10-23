import { siteMap } from '@/lib/siteMap';
import AdminCategoriesWrapper from '@/modules/admin/categories/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.users.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <AdminCategoriesWrapper />;

export default Page;
