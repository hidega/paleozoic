var commons = require('./commons')

var htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/> 
    <title>__TITLE__</title>
    <style>
      h3.jsd-title {
        font-size: 18px;
      }
      div.jsd-docs {
        font-size: 15px;
      }
      p.jsd-footer {
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <h3 class="jsd-title">
      __TITLE__
    </h3>
    <div class="jsd-docs">
      __DOCS__
    </div>
    <p class="jsd-footer">
      <i>created on: __DATE__</i>
    </p>
  </body>
</html>
` 

var reduceFstr = fstr => {
  if(fstr.includes('{')) {
    fstr = fstr.substring(0, fstr.search('{'))
  }
  if(fstr.includes('=')) {
    fstr = fstr.substring(0, fstr.search('=')) + '=>'
  }
  return fstr
}

var constructObject = (Ctr, args, path) => {
  var doc = ''
  if (path === '-') { 
    path = reduceFstr(Ctr.toString()).replace('function', '   ')
    path = path.substr(0, path.indexOf('\(')) 
  }
  try {
    var obj = new Ctr(args)
    Object.keys(obj).forEach(key => {
      var node = obj[key]
      if(commons.isArray(node)) {
        doc += `<br/>${path}#${key} : Array`
      } else if(commons.isFunction(node)) {
        doc += `<br/>${path}#${key} : ${reduceFstr(node.toString())}`
      } else if(commons.isObject(node)) {
        doc += `<br/>${path}#${key} : Object`
      } else {
        doc += `<br/>${path}#${key} : primitive`
      }
    })
  } catch(e) { console.log('Warning', e) }
  return doc
}

var functionToString = (f, path, allowedCtrs) => {
  var fstr = reduceFstr(f.toString()) 
  if(fstr.startsWith('function')) {
    var ctr = allowedCtrs.find(e => e.path === path)
    ctr && (fstr += constructObject(f, ctr.args, path))
  }
  return fstr
}

var extractDocs = (filename, cwd, skips, allowedCtrs) => {
  var MAX_DEPTH = 20
  var obj = require(filename)
  var f = (node, path, depth) => {
    var doc
    var processChildren = () => Object.keys(node).sort().reduce((acc, k) => acc += f(node[k], path + '.' + k, depth), '')
    if(++depth === MAX_DEPTH || skips.includes(path)) {
      doc = `<br/>${path} : N/A`
    } else if(commons.isArray(node)) {
      doc = `<br/>${path} : Array`
    } else if(commons.isFunction(node)) {
      var fstr = functionToString(node, path, allowedCtrs)
      doc = `<br/>${path} : ${fstr}` + processChildren()
    } else if(commons.isObject(node)) {
      doc = processChildren()
    } else if(commons.isString(node)) {
      doc = `<br/>${path} : String`
    } else if(commons.isNumber(node)) {
      doc = `<br/>${path} : Number`
    } else if(commons.isBoolean(node)) {
      doc = `<br/>${path} : Boolean`
    } else {
      doc = `<br/>${path} : NIL`
    }
    return doc
  }
  return `<br/><div><code>${filename.replace(cwd, '')}<br/>${f(obj, '-', 0)}</code></div><br/>`
}

module.exports = (params, callback) => commons.readJson(params.docSrc)
  .catch(() => ({}))
  .then(docSrc => commons.readJson(params.packageJson).then(pkg => ({ pkg, docSrc })))
  .then(data => {
    var srcs = (data.docSrc.sources || []).concat('src/index.js').map(e => commons.resolvePath(params.cwd, e))
    var title = data.pkg.name + ' v.' + data.pkg.version
    var html = htmlTemplate.replace(/__TITLE__/g, title).replace(/__DATE__/g, new Date().toISOString())
    var docs = srcs.reduce((acc, src) => acc + extractDocs(src, params.cwd, data.docSrc.skip || [], data.docSrc.allowedCtrs || []), '')
    return html.replace('__DOCS__', docs)
  })
  .then(result => commons.writeFile(params.docFile, result))
  .then(() => callback())
  .catch(e => callback(e || -1))

