import { siteMap } from '@/lib/siteMap';
import NewTaskWrapper from '@/modules/admin/tasks/wrappers/NewTaskWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.tasks.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <NewTaskWrapper />;

export default Page;
