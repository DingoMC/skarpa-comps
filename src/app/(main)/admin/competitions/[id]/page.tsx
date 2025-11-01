import { siteMap } from '@/lib/siteMap';
import EditCompetitionWrapper from '@/modules/admin/competitions/wrappers/EditCompetitionWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.competitions.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <EditCompetitionWrapper id={id} />;
};

export default Page;
