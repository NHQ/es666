var eat = require('./')()

var code = "var gamma = require('gamma'); console.log(gamma(9));"

console.log(eat, code)
eat(code)
