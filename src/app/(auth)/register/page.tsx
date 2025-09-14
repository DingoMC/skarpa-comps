import { siteMap } from '@/lib/siteMap';
import RegisterWrapper from '@/modules/register/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.register.pages.register.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <RegisterWrapper />;

export default Page;
