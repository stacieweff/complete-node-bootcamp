// console.log(arguments)
// console.log(require('module').wrapper)

//module.exports
const C = require('../starter/test-module-1')
const calc1 = new C()
console.log(calc1.add(2, 5))

//exports
// const calc2 = require('../starter/test-module-2')
const { add, multiply, divide } = require('../starter/test-module-2')
// console.log(calc2.multiply(2, 5))
console.log(multiply(2, 5))

//caching
require('../starter/test-module-3')()
require('../starter/test-module-3')()
require('../starter/test-module-3')()