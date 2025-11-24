import { IDataFormatter, IDataSource, IReporter } from './interfaces';

abstract class DataSource implements IDataSource {
  abstract fetchData(): string;
}

abstract class DataFormatter implements IDataFormatter {
  abstract format(data: string): string;
}

abstract class Reporter implements IReporter {
  constructor(
    protected dataSource: IDataSource,
    protected formatter: IDataFormatter
  ) {}

  abstract report(): void;
}

export { DataFormatter, DataSource, Reporter };
