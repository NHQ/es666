## es666

feed this module a string of javascript

it will detect the require()'s

then it will fetch each module as a standalone bundle from browserify-cdn

and then it will run your code

its like an asyncronous module loader for the browser

### useface

the module is function that takes 3 arguments.  two of them are optional.

the first arg is the string of source code.

pass another string as a URI for your brwoserify-cdn // default is https://wzrd.in/multi

pass a callback for cuz u know why callbacks

the callback will have 3 arguments: err, $return, and the function itself, where $return is the return value from executing your source, and the function itself is the function used to execute your source

```js
var eat = require('es666')
var code = "var gamma = require('gamma')"
eat(code, callBack)
```

### example

You can run this example by serving up public/index.html with a static file server like [ecstatic](https://npmjs.org/package/ecstatic), which can be used straight from the CLI.

```js

var eat = require('es666')

// a string of code with a require in it:
var code = "var gamma = require('gamma'); console.log(gamma(9));"

eat(code, function(err, $returnValue, fn){
  // $return is the return value from the execution of the source code
  // fn isthe function that returned that value
})

```

