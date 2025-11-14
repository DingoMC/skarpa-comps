import { siteMap } from '@/lib/siteMap';
import CompSignupsWrapper from '@/modules/comp_signups/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.comp_signups.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <CompSignupsWrapper />;

export default Page;
