import { siteMap } from '@/lib/siteMap';
import MainPageWrapper from '@/modules/main/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.home.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <MainPageWrapper />;

export default Page;
