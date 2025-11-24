export interface IDataSource {
  fetchData(): string;
}

export interface IDataFormatter {
  format(data: string): string;
}

export interface IReporter {
  report(): void;
}
