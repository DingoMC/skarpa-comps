export interface SiteMapPage {
  id: number;
  hidden?: boolean;
  noDataMessage?: string;
  name: string;
  tabName: string;
  href: string;
  icon: React.JSX.Element;
}

export interface Section {
  id: number;
  title: string;
  pages: { [key: string]: SiteMapPage };
}
