'use strict'

var spawnCmd = require('./spawn-cmd')

function Tools() {}

Tools.spawnCmd = spawnCmd

Tools.cleanStr = obj => obj ? obj.toString().replace(/\\\\\\\\/g, '\\\\').replace(/\\\\\\/g, '\\\\') : ''

Tools.error = err => console.error(`ERROR: ${Tools.cleanStr(err)}`)

Tools.errorJson = err => console.error(`ERROR:\n${Tools.cleanStr(JSON.stringify(err, null, 2))}`)

Tools.info = str => console.log(`INFO: ${Tools.cleanStr(str)}`)

Tools.infoJson = str => console.error(`INFO:\n${Tools.cleanStr(JSON.stringify(str, null, 2))}`)

Tools.fullUsername = (name, host) => `'${name}'@'${host}'`

module.exports = Object.freeze(Tools)
