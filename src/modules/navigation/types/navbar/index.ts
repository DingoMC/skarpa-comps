export interface NavbarMediator {
  toggleNav(): void;
  closeNav(): void;
  isOpen(): boolean;
  subscribe(listener: (isOpen: boolean) => void): () => void;
}
