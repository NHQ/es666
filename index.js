var http = require('hyperquest')
var detect = require('detective')
var concat = require('concat-stream')
var endpoint = "http://wzrd.in/multi"

module.exports = function(uri, cb){
  if("string" == typeof uri) endpoint = uri
  if("function" == typeof uri){
    cb = uri
  }
  var moduleCache = {}
  t = 0, i = 0, rate = 44100 
  var _require = require
  require = function(module){
    if(moduleCache[module]) return moduleCache[module].exports
      else return _require(module)
  }

  return function(str){
    var _fn = new Function(['require'], str)
    var modules = detect(_fn.toString())
    if(modules.length){
      var body = {"options":{"standalone":true}, dependencies: {}}
      var cached = []
      var help = {}
      modules.forEach(function(module){
        if(moduleCache[module]) {
          cached.push(module)            
          return
        }
        else{
          body.dependencies[module.split('@')[0]] = module.split('@')[1] || ''
          help[module] = module.split('@')[0]
        }
      })
      if(cached.length == modules.length) {
        // all cached
        var fn = new Function(str)()
        var x = fn()
        if(cb) cb(null, x, fn)
      }
      else{
        var post = http.post(endpoint, function(err, res){
          console.log(err, res)
        })
        post.pipe(concat(function(data){
            var mods = JSON.parse(data);
            var names = Object.keys(mods)
            names.forEach(function(name){
              var x = moduleCache[help[name]] = mods[name]
              var m = {exports: {}}
              Function([help[name]], x.bundle)(m)
              moduleCache[help[name]].exports = m.exports
            })
            var fn = _fn(require)
            var x = fn()
            if(cb) cb(null, x, fn) 
        }))
        post.on('end', function(){
          console.log('end')
        })
        post.write(JSON.stringify(body))
        post.on('error', function(err){
          if(cb) cb(err)
        })

      }
    }
    else{
      var fn = new Function(str)()
      var x = fn()
      if(cb) cb(null, x, fn)
    }
  }
}
