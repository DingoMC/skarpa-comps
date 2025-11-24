import { DataFormatter, DataSource, Reporter } from './abstract';

class FileDataSource extends DataSource {
  fetchData(): string {
    return 'Dane z pliku';
  }
}

class UpperCaseFormatter extends DataFormatter {
  format(data: string): string {
    return data.toUpperCase();
  }
}

class ConsoleReporter extends Reporter {
  report(): void {
    const data = this.dataSource.fetchData();
    const formatted = this.formatter.format(data);
    console.log('Log:', formatted);
  }
}

export { ConsoleReporter, FileDataSource, UpperCaseFormatter };
