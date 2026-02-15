import { FaHome, FaTasks, FaUsers } from 'react-icons/fa';
import { FaRankingStar, FaRegAddressBook, FaTableList, FaUser } from 'react-icons/fa6';
import { IoLogoAndroid } from 'react-icons/io';
import { LuNotebookPen } from 'react-icons/lu';
import { MdFamilyRestroom, MdLogin } from 'react-icons/md';
import { PiUserList } from 'react-icons/pi';
import { ADMIN_AUTH_LEVEL, GUEST_AUTH_LEVEL, USER_AUTH_LEVEL } from './constants';
import { objectValues } from './object';
import { UserUI } from './types/auth';
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
      results: {
        id: 3,
        name: 'Wyniki',
        tabName: tabName('Wyniki'),
        href: '/results',
        icon: <FaRankingStar className={icon} />,
      },
      profile: {
        id: 4,
        name: 'Mój Profil',
        authLevel: (ual: number | null) => ual !== null && ual >= USER_AUTH_LEVEL,
        tabName: tabName('Mój Profil'),
        href: '/profile',
        icon: <FaUser className={icon} />,
      },
    },
  },
  login: {
    id: 1,
    title: 'Logowanie',
    authLevel: (ual: number | null) => ual === null || ual === GUEST_AUTH_LEVEL,
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
    authLevel: (ual: number | null) => ual === null || ual === GUEST_AUTH_LEVEL,
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
  skarpa: {
    id: 3,
    title: 'Skarpa',
    authLevel: (ual: number | null) => ual !== null && ual >= USER_AUTH_LEVEL,
    userAuth: (u: UserUI | null) => u?.isClubMember ?? false,
    pages: {
      apps: {
        id: 0,
        name: 'Aplikacje',
        tabName: tabName('Aplikacje'),
        href: '/skarpa/apps',
        icon: <IoLogoAndroid className={icon} />,
      },
    },
  },
  admin: {
    id: 10,
    title: 'Admin',
    authLevel: (ual: number | null) => ual !== null && ual >= ADMIN_AUTH_LEVEL,
    pages: {
      users: {
        id: 0,
        name: 'Użytkownicy',
        tabName: tabName('Użytkownicy'),
        href: '/admin/users',
        icon: <FaUsers className={icon} />,
      },
      competitions: {
        id: 1,
        name: 'Zawody',
        tabName: tabName('Zawody'),
        href: '/admin/competitions',
        icon: <FaRankingStar className={icon} />,
      },
      tasks: {
        id: 2,
        name: 'Zadania',
        tabName: tabName('Zadania'),
        href: '/admin/tasks',
        competitionSelector: true,
        icon: <FaTasks className={icon} />,
      },
      enrolls: {
        id: 3,
        name: 'Listy Startowe',
        tabName: tabName('Listy Startowe'),
        href: '/admin/enrolls',
        competitionSelector: true,
        icon: <PiUserList className={icon} />,
      },
      families: {
        id: 4,
        name: 'Rodziny',
        tabName: tabName('Rodzinna'),
        href: '/admin/families',
        competitionSelector: true,
        icon: <MdFamilyRestroom className={icon} />,
      },
      categories: {
        id: 5,
        name: 'Kategorie',
        tabName: tabName('Kategorie'),
        href: '/admin/categories',
        competitionSelector: true,
        icon: <FaTableList className={icon} />,
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
    '/admin/users/new': siteMap.admin.pages.users,
    '/admin/users/[id]': siteMap.admin.pages.users,
    '/admin/competitions/new': siteMap.admin.pages.competitions,
    '/admin/competitions/[id]': siteMap.admin.pages.competitions,
    '/admin/enrolls/new': siteMap.admin.pages.enrolls,
    '/admin/enrolls/[id]': siteMap.admin.pages.enrolls,
    '/admin/enrolls/[id]/results': siteMap.admin.pages.enrolls,
    '/admin/tasks/new': siteMap.admin.pages.tasks,
    '/admin/tasks/[id]': siteMap.admin.pages.tasks,
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
    '/admin/users/new': siteMap.admin,
    '/admin/users/[id]': siteMap.admin,
    '/admin/competitions/new': siteMap.admin,
    '/admin/competitions/[id]': siteMap.admin,
    '/admin/enrolls/new': siteMap.admin,
    '/admin/enrolls/[id]': siteMap.admin,
    '/admin/enrolls/[id]/results': siteMap.admin,
    '/admin/tasks/new': siteMap.admin,
    '/admin/tasks/[id]': siteMap.admin,
    '/admin/tasks/[id]/results': siteMap.admin,
  },
  siteMap.home
);
