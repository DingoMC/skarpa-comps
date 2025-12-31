import { siteMap } from '@/lib/siteMap';
import AdminEnrollsWrapper from '@/modules/admin/enrolls/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.enrolls.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <AdminEnrollsWrapper />;

export default Page;
