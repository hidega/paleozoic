var commons = require('./commons')
var { JSHINT } = require('jshint')
var fetchDirents = require('./fetch-dirents')
var options = require('./jshint-cfg.json')

var prettyPrint = obj => obj ? '\n' + JSON.stringify(obj, null, 2) + '\n' : '0'

var jshint = (file, buffer, opts) => commons.readFile(file).then(src => {
  JSHINT(src.toString(), Object.assign(options, opts || {}), {})
  buffer.data += `<sourceFile path="${file}" errorsCount="${JSHINT.errors.length}">\n`
  var result = JSHINT.data()
  buffer.data += `<unused>${prettyPrint(result.unused)}</unused>\n<errors>${prettyPrint(result.errors)}</errors>\n`
  buffer.data += '</sourceFile>\n'
  return JSHINT.errors.length
})

module.exports = (params, callback, buffer) => fetchDirents(params.srcDir)
  .then(commons.direntsToFilenames)
  .then(files => {
    buffer = { data: '</jshintResults>\n<sources>\n' }
    return Promise.all(files.map(file => file.endsWith('.js') ? jshint(file, buffer, params.options) : Promise.resolve(0)))
  })
  .then(errors => {
    buffer.data += '</sources>\n<sourceCount>' + errors.length + '</sourceCount>\n<totalErrors>' + errors.reduce((acc, e) => acc + e, 0) + '</totalErrors>\n<jshintResults>\n'
    console.log(buffer.data)
    return params.args && params.args[0] === 'file' ? commons.writeFile(params.reportFile, buffer.data) : Promise.resolve()
  })
  .then(() => {
    var err = !buffer.data.includes('<totalErrors>0</totalErrors>')
    err ? callback('Errors in sources') : callback()
  })
  .catch(e => callback(e || -1))
