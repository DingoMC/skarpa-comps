export interface SiteMapPage {
  id: number;
  hidden?: boolean;
  noDataMessage?: string;
  name: string;
  tabName: string;
  href: string;
  authLevel?: (userAuthLevel: number | null) => boolean;
  icon: React.JSX.Element;
}

export interface Section {
  id: number;
  title: string;
  authLevel?: (userAuthLevel: number | null) => boolean;
  pages: { [key: string]: SiteMapPage };
}
