import { siteMap } from '@/lib/siteMap';
import EditEnrollWrapper from '@/modules/admin/enrolls/wrappers/EditEnrollWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.enrolls.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <EditEnrollWrapper id={id} />;
};

export default Page;
