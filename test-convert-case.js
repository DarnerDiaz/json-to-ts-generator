const { stringToTypeScript } = require('./dist/src/generator');

const json = '{"first_name":"John","last_name":"Doe"}';

console.log('=== Without convertCase ===');
const result1 = stringToTypeScript(json, { name: 'User' });
console.log(result1);

console.log('\n=== With convertCase: true ===');
const result2 = stringToTypeScript(json, { name: 'User', convertCase: true });
console.log(result2);
