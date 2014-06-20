var detect = require('detective')
var endpoint = "http://wzrd.in/multi"
var moduleCache = {}
var _require = require
require = function(module){
  if(moduleCache[module]) return moduleCache[module].exports
    else return _require(module)
}

module.exports = function(str, uri, cb){
    if('function' == typeof uri) cb = uri
    if('string' == typeof uri) endpoint = uri
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
        var fn = new Function(str)
        var x = fn()
        if(cb) cb(null, x, fn)
      }
      else{
        var post = new XMLHttpRequest();
        post.open('POST', endpoint, true)
        post.onload = function(e){
          if(this.status == 200){
            var mods = JSON.parse(this.responseText);
            var names = Object.keys(mods)
            names.forEach(function(name){
              moduleCache[help[name]] = mods[name]
              var m = {exports: {}}
              var e = m.exports
              var x = new Function(["module", "exports"], mods[name].bundle)
              x(m, e)
              moduleCache[help[name]].exports = m.exports
            })
            var x = _fn(require)
            if(cb) cb(null, x, _fn)
          }
          else console.log(this.status)
        } 
        post.send(JSON.stringify(body))
      }
    }
    else{
      var fn = new Function(str)
      var x = fn()
      if(cb) cb(null, x, fn)
    }
}
