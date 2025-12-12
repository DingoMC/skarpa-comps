import { siteMap } from '@/lib/siteMap';
import AdminTasksWrapper from '@/modules/admin/tasks/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.tasks.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <AdminTasksWrapper />;

export default Page;
