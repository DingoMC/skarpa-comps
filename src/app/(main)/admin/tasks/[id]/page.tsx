import { siteMap } from '@/lib/siteMap';
import EditTaskWrapper from '@/modules/admin/tasks/wrappers/EditTaskWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.tasks.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <EditTaskWrapper id={id} />;
};

export default Page;
