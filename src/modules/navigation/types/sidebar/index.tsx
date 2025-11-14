import { ReactNode } from "react";

export interface SidebarState {
  toggle(): SidebarState;
  isExpanded(): boolean;
  getWidthClass(): string;
  getArrowRotationClass(): string;
  renderHeader(sectionTitle: string): ReactNode;
}
