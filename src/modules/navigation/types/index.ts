import { ReactNode } from 'react';

export type MenuItemType =
  | {
    type: 'link';
    label: string;
    icon: ReactNode;
    link: string;
  }
| {
  type: 'action';
  label: string;
  icon: ReactNode;
  action: () => void;
};
