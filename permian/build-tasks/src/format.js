var commons = require('./commons')
var fetchDirents = require('./fetch-dirents')
var beautify = require('js-beautify').js
var beautifyParameters = require('./js-beautify-cfg.json')

var formatSource = (data, file) => {
  if(file.endsWith('.js')) {
    data = data.replace(/\r/g, '')
    data = data.replace(/[ ]+\n/g, '\n')
    data = data.replace(/\t/g, '  ')
    data = data.replace(/\n{3,}/g, '\n\n')
    data = beautify(data, beautifyParameters)
  } else {
    try {
      data = JSON.stringify(JSON.parse(data), null, 2)
    } catch(e) {
      console.log('Warning: bad file: ' + file)
    }
  }
  return data
}

var formatFile = file => commons.readFile(file)
  .then(data => formatSource(data.toString(), file))
  .then(data => commons.writeFile(file, data))

var processFiles = files => files.filter(file => file.endsWith('.js') || file.endsWith('.json')).map(formatFile)

module.exports = (params, callback) => fetchDirents(params.srcDir)
  .then(commons.direntsToFilenames)
  .then(files => Promise.all(processFiles(files)))
  .then(() => callback())
  .catch(e => callback(e || -1))
