import { siteMap } from '@/lib/siteMap';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.home.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <div>Strona Główna</div>;

export default Page;
