const array = new Uint32Array(25);
crypto.getRandomValues(array);

const cpy = [...array];

const str = cpy
  .map((v) => {
    const val = v % 36;
    if (val <= 9) return String.fromCharCode(val + 48);
    return String.fromCharCode(val + 87);
  })
  .join('');

console.log(str);
