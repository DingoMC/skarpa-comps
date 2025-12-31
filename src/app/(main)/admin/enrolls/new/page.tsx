import { siteMap } from '@/lib/siteMap';
import NewEnrollWrapper from '@/modules/admin/enrolls/wrappers/NewEnrollWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.enrolls.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <NewEnrollWrapper />;

export default Page;
