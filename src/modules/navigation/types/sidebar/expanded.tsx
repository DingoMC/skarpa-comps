import { ReactNode } from "react";
import { SidebarState } from ".";
import { CollapsedState } from "./collapsed";

export class ExpandedState implements SidebarState {
  toggle() {
    return new CollapsedState();
  }

  isExpanded() {
    return true;
  }

  getWidthClass(): string {
    return 'w-50';
  }

  getArrowRotationClass() {
    return '';
  }

  renderHeader(title: string): ReactNode {
    return <div className="text-main font-medium py-2 pl-4">{title}</div>;
  }
}
