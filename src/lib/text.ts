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

export const showDate = (date: Date, seconds: boolean = true) => {
  const str = new Date(date).toLocaleString();
  if (seconds) return str;
  return str.slice(0, str.length - 3);
};

export const cleanName = (name: string) =>
  name
    .toLowerCase()
    .replaceAll(' ', '')
    .replaceAll('-', '')
    .replaceAll('ą', '')
    .replaceAll('ć', '')
    .replaceAll('ę', '')
    .replaceAll('ł', '')
    .replaceAll('ń', '')
    .replaceAll('ó', '')
    .replaceAll('ś', '')
    .replaceAll('ż', '')
    .replaceAll('ź', '');

export const childEmail = (email: string, firstName: string, lastName: string) => {
  const [e, d] = email.split('@');
  const fn = cleanName(firstName);
  const ln = cleanName(lastName).length > 3 ? cleanName(lastName).slice(0, 3) : cleanName(lastName);
  return `${e}+${fn}${ln}@${d}`;
};
