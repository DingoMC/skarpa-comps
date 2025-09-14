import { siteMap } from '@/lib/siteMap';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.comp_signups.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <div>Zapisy</div>;

export default Page;
