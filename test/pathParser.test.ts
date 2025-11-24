import URLPathParser from '@/lib/axios/parser/pathParser';

const pathParser = new URLPathParser();

test('URLPathParser: Parse none', () => {
  expect(pathParser.parse('example.com')).toBe('example.com');
  expect(pathParser.parse('example.com', {})).toBe('example.com');
  expect(pathParser.parse('example.com', [])).toBe('example.com');
});

test('URLPathParser: Parse single (object way)', () => {
  expect(pathParser.parse('{domain}/home', { domain: 'example.com' })).toBe('example.com/home');
  expect(pathParser.parse('example.com/{page}/172', { page: 'post' })).toBe('example.com/post/172');
  expect(pathParser.parse('example.com/post/{postId}', { postId: 172 })).toBe('example.com/post/172');
  expect(pathParser.parse('example.com/post/{postId}', { postId: 172, uselessField: 'yes' })).toBe('example.com/post/172');
});

test('URLPathParser: Parse single (array way)', () => {
  expect(pathParser.parse('{1}/home', ['example.com'])).toBe('example.com/home');
  expect(pathParser.parse('example.com/{1}/172', ['post'])).toBe('example.com/post/172');
  expect(pathParser.parse('example.com/post/{1}', [172])).toBe('example.com/post/172');
  expect(pathParser.parse('example.com/post/{2}', ['uselessThing', 172])).toBe('example.com/post/172');
});

test('URLPathParser: Parse multi (object way)', () => {
  expect(pathParser.parse('{domain}/{page}', { domain: 'example.com', page: 'home' })).toBe('example.com/home');
  expect(pathParser.parse('example.com/{page}/{postId}', { page: 'post', postId: 172 })).toBe('example.com/post/172');
  expect(pathParser.parse('example.com/{page}/{postId}', { page: 'post', postId: 172, uselessField: 'yes' })).toBe('example.com/post/172');
});

test('URLPathParser: Parse multi (array way)', () => {
  expect(pathParser.parse('{1}/{2}', ['example.com', 'home'])).toBe('example.com/home');
  expect(pathParser.parse('example.com/{1}/{2}', ['post', 172])).toBe('example.com/post/172');
  expect(pathParser.parse('example.com/{1}/{3}', ['post', null, 172])).toBe('example.com/post/172');
});
