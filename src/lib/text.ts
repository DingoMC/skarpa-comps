export const capitalizeFirstLetter = (val: string) => {
  if (!val.length) return '';
  return `${val[0].toUpperCase()}${val.substring(1)}`;
};

export const transformName = (name: string) => {
  if (name.includes(' ')) {
    return name
      .split(' ')
      .map((v) => capitalizeFirstLetter(v))
      .join(' ');
  }
  if (name.includes('-')) {
    return name
      .split('-')
      .map((v) => capitalizeFirstLetter(v))
      .join('-');
  }
  return capitalizeFirstLetter(name);
};

export const displayFullName = (firstName: string, lastName: string) => `${transformName(firstName)} ${transformName(lastName)}`;

export const transformRoleName = (name: string) => {
  if (name.includes('_')) {
    return name
      .split('_')
      .map((v) => capitalizeFirstLetter(v))
      .join(' ');
  }
  return capitalizeFirstLetter(name);
};

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
