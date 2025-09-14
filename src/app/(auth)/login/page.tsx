import { siteMap } from '@/lib/siteMap';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.login.pages.login.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <div>Logowanie</div>;

export default Page;
