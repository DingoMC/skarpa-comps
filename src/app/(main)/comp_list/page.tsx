import { siteMap } from '@/lib/siteMap';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.comp_list.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <div>Lista Startowa</div>;

export default Page;
