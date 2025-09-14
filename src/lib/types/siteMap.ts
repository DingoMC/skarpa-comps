export interface SiteMapPage {
  id: number;
  hidden?: boolean;
  noDataMessage?: string;
  name: string;
  tabName: string;
  href: string;
  authLevel?: number | ((userAuthLevel: number) => boolean);
  icon: React.JSX.Element;
}

export interface Section {
  id: number;
  title: string;
  authLevel?: number | ((userAuthLevel: number) => boolean);
  pages: { [key: string]: SiteMapPage };
}
