import { siteMap } from '@/lib/siteMap';
import ProfileWrapper from '@/modules/profile/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.profile.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <ProfileWrapper />;

export default Page;
