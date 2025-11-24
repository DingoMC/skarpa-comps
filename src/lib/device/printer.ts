export interface IPrinterDevice {
  print(): void;
  scan(): void;
  fax(): void;
  copy(): void;
}
