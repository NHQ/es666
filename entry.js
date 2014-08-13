var eat = require('./')

var code = "var gamma = require('gamma'); console.log(gamma(9));"

eat(code, function(err, $return, fn){

  // $return is the return value from executing your source code
  // fn is the source, funcified

  console.log(err, $return, fn)

})
eat(code, function(err, $return, fn){

  // $return is the return value from executing your source code
  // fn is the source, funcified

  console.log(err, $return, fn)

})
