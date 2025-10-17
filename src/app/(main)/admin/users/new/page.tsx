import { siteMap } from '@/lib/siteMap';
import NewUserWrapper from '@/modules/admin/users/wrappers/NewUserWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.users.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <NewUserWrapper />;

export default Page;
