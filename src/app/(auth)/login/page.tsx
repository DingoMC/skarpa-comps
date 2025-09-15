import { siteMap } from '@/lib/siteMap';
import LoginWrapper from '@/modules/login/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.login.pages.login.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <LoginWrapper />;

export default Page;
