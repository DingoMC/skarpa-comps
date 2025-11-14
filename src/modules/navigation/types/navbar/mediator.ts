import { NavbarMediator } from '.';

export class NavbarMediatorImpl implements NavbarMediator {
  private listeners: ((isOpen: boolean) => void)[] = [];
  private _isOpen = false;

  toggleNav() {
    this._isOpen = !this._isOpen;
    this.notify();
  }

  closeNav() {
    this._isOpen = false;
    this.notify();
  }

  isOpen() {
    return this._isOpen;
  }

  subscribe(listener: (isOpen: boolean) => void) {
    this.listeners.push(listener);
    listener(this._isOpen);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) listener(this._isOpen);
  }
}
