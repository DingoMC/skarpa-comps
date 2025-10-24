import { SidebarState } from '.';
import { ExpandedState } from './expanded';

export class CollapsedState implements SidebarState {
  toggle() {
    return new ExpandedState();
  }

  isExpanded() {
    return false;
  }

  getWidthClass() {
    return 'w-12';
  }

  getArrowRotationClass() {
    return 'rotate-180';
  }

  renderHeader() {
    return null;
  }
}
