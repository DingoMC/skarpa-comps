import { FaHome } from 'react-icons/fa';
import { FaRegAddressBook } from 'react-icons/fa6';
import { LuNotebookPen } from 'react-icons/lu';
import { MdLogin } from 'react-icons/md';
import { PiUserList } from 'react-icons/pi';
import { objectValues } from './object';
import ObjectWithFallback from './types/objectWithFallback';
import { Section, SiteMapPage } from './types/siteMap';

const icon = 'h-5 w-5';

const tabName = (name: string) => `Skarpa Comps - ${name}`;

export const siteMap = {
  home: {
    id: 0,
    title: 'Główna',
    pages: {
      home: {
        id: 0,
        name: 'Strona Główna',
        tabName: tabName('Strona Główna'),
        href: '/',
        icon: <FaHome className={icon} />,
      },
      comp_signups: {
        id: 1,
        name: 'Zapisy',
        tabName: tabName('Zapisy'),
        href: '/comp_signups',
        icon: <LuNotebookPen className={icon} />,
      },
      comp_list: {
        id: 2,
        name: 'Lista Startowa',
        tabName: tabName('Lista Startowa'),
        href: '/comp_list',
        icon: <PiUserList className={icon} />,
      },
    },
  },
  login: {
    id: 1,
    title: 'Logowanie',
    authLevel: (ual: number | null) => ual === null || ual === 0,
    pages: {
      login: {
        id: 0,
        name: 'Zaloguj się',
        tabName: tabName('Logowanie'),
        href: '/login',
        icon: <MdLogin className={icon} />,
      },
    },
  },
  register: {
    id: 2,
    title: 'Rejestracja',
    authLevel: (ual: number | null) => ual === null || ual === 0,
    pages: {
      register: {
        id: 0,
        name: 'Zarejestruj się',
        tabName: tabName('Rejestracja'),
        href: '/register',
        icon: <FaRegAddressBook className={icon} />,
      },
    },
  },
};

/**
 * Iterates over sitemap to return object with `href` as a key and `page` as a value.
 * Used in `siteMapByPath` to quickly get page object using URL path.
 */
const hrefPageKeyPair = () => {
  const keyPair: { [key: string]: SiteMapPage } = {};
  objectValues(siteMap).forEach((section) => {
    const pages: SiteMapPage[] = objectValues(section.pages);
    pages.forEach((page) => {
      keyPair[page.href] = page;
    });
  });
  return keyPair;
};

/**
 * Iterates over sitemap to return object with `href` as a key and `section` as a value.
 * Used in `sectionByPath` to quickly get section object using URL path.
 */
const hrefSectionKeyPair = () => {
  const keyPair: { [key: string]: Section } = {};
  objectValues(siteMap).forEach((section) => {
    const pages: SiteMapPage[] = objectValues(section.pages);
    pages.forEach((page) => {
      keyPair[page.href] = section;
    });
  });
  return keyPair;
};

/**
 * Returns siteMap page object by the path given.
 * If not found, returns home page.
 * Dynamic routes should be manually added.
 */
export const siteMapByPath = new ObjectWithFallback<SiteMapPage>(
  {
    ...hrefPageKeyPair(),
  },
  siteMap.home.pages.home
);

/**
 * Returns siteMap section object by the path given.
 * If not found, returns home section.
 * Dynamic routes should be manually added.
 */
export const sectionByPath = new ObjectWithFallback<Section>(
  {
    ...hrefSectionKeyPair(),
  },
  siteMap.home
);
