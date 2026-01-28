import { siteMap } from '@/lib/siteMap';
import EditUserResultsWrapper from '@/modules/admin/enrolls/wrappers/ResultsWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.enrolls.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <EditUserResultsWrapper id={id} />;
};

export default Page;
