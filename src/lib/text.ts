export default class TextFormatter {
  private capitalizeFirstLetter(val: string): string {
    if (!val.length) return '';
    return `${val[0].toUpperCase()}${val.substring(1)}`;
  }

  private transformWithDelimiter(val: string, delimiter: string): string {
    return val
      .split(delimiter)
      .map((v) => this.capitalizeFirstLetter(v))
      .join(delimiter === '_' ? ' ' : delimiter);
  }

  transformName(name: string): string {
    if (name.includes(' ')) return this.transformWithDelimiter(name, ' ');
    if (name.includes('-')) return this.transformWithDelimiter(name, '-');
    return this.capitalizeFirstLetter(name);
  }

  displayFullName(firstName: string, lastName: string): string {
    return `${this.transformName(firstName)} ${this.transformName(lastName)}`;
  }

  transformRoleName(role: string): string {
    if (role.includes('_')) return this.transformWithDelimiter(role, '_');
    return this.capitalizeFirstLetter(role);
  }
}
