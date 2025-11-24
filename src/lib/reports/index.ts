import { ConsoleReporter, FileDataSource, UpperCaseFormatter } from "./impl";
import { IDataFormatter, IDataSource, IReporter } from "./interfaces";

export const initializeReporter = () => {
  const dataSource: IDataSource = new FileDataSource();
  const formatter: IDataFormatter = new UpperCaseFormatter();

  const reporter: IReporter = new ConsoleReporter(dataSource, formatter);

  reporter.report();
};
