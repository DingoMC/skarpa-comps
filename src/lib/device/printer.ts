interface IPrinter {
  print(): void;
}

interface IScanner {
  scan(): void;
}

interface IFax {
  fax(): void;
}

interface ICopier {
  copy(): void;
}

class BasicPrinter implements IPrinter {
  print(): void {
    console.log('Printing...');
  }
}

class OfficeMultiDevice implements IPrinter, IScanner, IFax, ICopier {
  print() {
    console.log('Printing...');
  }
  scan() {
    console.log('Scanning...');
  }
  fax() {
    console.log('Sending Fax...');
  }
  copy() {
    console.log('Copying...');
  }
}
