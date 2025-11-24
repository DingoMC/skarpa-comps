import TextFormatter from "@/lib/text";

const formatter = new TextFormatter();

test('Test Simple Name', () => {
  expect(formatter.transformName('mArCin')).toBe('Marcin');
});

test('Test Complex Name', () => {
  expect(formatter.transformName('nazwiskoA-nazwiskoB')).toBe('Nazwiskoa-Nazwiskob');
  expect(formatter.transformName('nazwiskoA nazwiskoB')).toBe('Nazwiskoa Nazwiskob');
});

test('Test Full Name', () => {
  expect(formatter.displayFullName('mArcIN', 'basAk')).toBe('Marcin Basak');
  expect(formatter.displayFullName('marcin', 'basak')).toBe('Marcin Basak');
});

test('Test Full Complex', () => {
  expect(formatter.displayFullName('mArcIN', 'basAk-tasak')).toBe('Marcin Basak-Tasak');
  expect(formatter.displayFullName('marcin', 'basak TASAK')).toBe('Marcin Basak Tasak');
});

test('Test Role Name', () => {
  expect(formatter.transformRoleName('admin')).toBe('Admin');
  expect(formatter.transformRoleName('super_admin')).toBe('Super Admin');
});
