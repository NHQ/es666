## es666

feed this module a string of javascript
it will detect the require()'s
then it will fetch each module as a standalone bundle from browserify-cdn
and then it will run your code
its like an asyncronous module loader for the browser

### useface

the module constructor takes one optional arguments, the URI for your browserify-cdn.  the default is to use http://wzrd.in.

the returned function takes two arguments:  a string of code, and an optional callback, which would be run after the code is executed.

the callback will have 3 arguments: err, $return, and the function itself
where $return is the return value from executing your source
and the function itself is the function used to execute your source

```js
var eat = require('es666')('http://wzrd.in/') // the default
var code = "var gamma = require('gamma')"
eat(code, callBack)
```

### example

You can run this example by serving up public/index.html with a static file server like [ecstatic](https://npmjs.org/package/ecstatic), which can be used straight from the CLI.

'''js

var eat = require('es666')()

// a string of code with a require in it:
var code = "var gamma = require('gamma'); console.log(gamma(9));"

eat(code, function(err, $returnValue, fn){
  // $return is the return value from the execution of the source code
  // fn isthe function that returned that value
})

'''
