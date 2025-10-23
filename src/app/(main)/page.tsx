import { siteMap } from '@/lib/siteMap';
import MainPage from '@/modules/main/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.home.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <MainPage />;

export default Page;
