import { formatCurrency } from '../scripts/utils/money.js';

console.log('test suite: Format Currency')
console.log('Convert Cents to Doller');

if (formatCurrency(2095) === '20.95') {
  console.log('passed');
}else {
  console.log('failed');
}

console.log('Working with 0');
if(formatCurrency(0) === '0.00'){
  console.log('passed')
}else {
  console.log('fialed');
}
console.log('Round up with nearest cents');
if(formatCurrency(2000.5) === '20.01'){
  console.log('passed');
  
}else {
  console.log('failed');
  
}