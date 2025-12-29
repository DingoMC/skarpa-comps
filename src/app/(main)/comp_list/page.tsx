import { siteMap } from '@/lib/siteMap';
import StartListsWrapper from '@/modules/start_lists/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.comp_list.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <StartListsWrapper />;

export default Page;
