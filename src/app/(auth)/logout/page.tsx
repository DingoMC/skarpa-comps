import Logout from '@/modules/logout/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wylogowywanie...',
  description: 'Witamy na stronie - Zawody Skarpa Lublin',
};

const Page = () => <Logout />;

export default Page;
