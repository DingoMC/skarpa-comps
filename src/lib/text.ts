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
