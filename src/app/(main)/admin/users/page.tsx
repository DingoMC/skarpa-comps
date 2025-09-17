import { siteMap } from '@/lib/siteMap';
import AdminUsersWrapper from '@/modules/admin/users/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.users.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <AdminUsersWrapper />;

export default Page;
