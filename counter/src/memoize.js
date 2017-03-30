const memoize = require('fast-memoize')

function fn(one, two, three) {
  console.log('called')
  return {one: one, two: two, three: three}
}

const memoized = memoize(fn)

let result1 = memoized('foo', 3, 'bar')
console.log(result1)
let result2 = memoized('foo', 3, 'bar')
console.log(result2)
console.log(result1 == result2)
