import { siteMap } from '@/lib/siteMap';
import ResultsWrapper from '@/modules/results/wrappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMap.home.pages.results.tabName,
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <ResultsWrapper />;

export default Page;
