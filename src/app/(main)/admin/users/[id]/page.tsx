import { siteMap } from '@/lib/siteMap';
import EditUserWrapper from '@/modules/admin/users/wrappers/EditUserWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.admin.pages.users.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <EditUserWrapper id={id} />;
};

export default Page;
