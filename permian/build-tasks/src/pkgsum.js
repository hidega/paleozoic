var crypto = require('crypto')
var commons = require('./commons')
var fetchDirents = require('./fetch-dirents')

var hashBuffer = b => crypto.createHash('md5').update(b).digest('hex')

var combineHashes = hashes => {
  var combined = Array.isArray(hashes) ? hashes.reduce((acc, hash) => acc + (hash ? hash.toString() : ''), '') : ''
  return hashBuffer(Buffer.from(combined))
}

var normalizeOptions = options => {
  options ??= {}
  options.hashes ??= []
  options.files ??= []
  options.dirs ??= []
  return options
}

var direntContents = de => de.isDirectory() ? Promise.resolve(Buffer.from(de.name)) : commons.readFile(de.name) 

var flatten = a => Array.isArray(a) ? a.reduce((acc, e) => {
  Array.isArray(e) ? (acc = acc.concat(e)) : acc.push(e)
  return acc
}, []) : [] 

var filenameToDirent = fn => ({
  isFile: () => true,
  isDirectory: () => false,
  name: fn
})

var pkgsum = options => {
  options = normalizeOptions(options)
  return Promise.all(options.dirs.map(fetchDirents))
    .then(filelists => flatten(filelists.concat(options.files.map(filenameToDirent))))
    .then(dirents => Promise.all(dirents.map(de => direntContents(de))))
    .then(contents => contents.map(hashBuffer)) 
    .then(hashes => combineHashes(hashes.concat(options.hashes)))
} 

module.exports = (params, callback) => pkgsum({
    dirs: [params.subjectDir],
    files: [params.packageJson]
  })
  .then(hash => commons.writeFile(params.hashFile, `{"pkgsum":"${hash}","timestamp":${Date.now()}}`))
  .then(() => callback())
  .catch(e => callback(e || -1))
