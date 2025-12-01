import { siteMap } from '@/lib/siteMap';
import AppsPage from '@/modules/skarpa/apps/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.skarpa.pages.apps.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <AppsPage />;

export default Page;
