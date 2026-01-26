import { siteMap } from '@/lib/siteMap';
import EditTaskResultsWrapper from '@/modules/admin/tasks/wrappers/ResultsWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.tasks.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <EditTaskResultsWrapper id={id} />;
};

export default Page;
