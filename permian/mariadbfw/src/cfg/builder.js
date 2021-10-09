'use strict'

var commons = require('../commons')

function ConfigBuilder() {
  var text = {
    clientGroup: '',
    mariadbGroup: ''
  }

  var assignment = '='

  var appendEntry = (key, value, id) => text[id] += value ? `${key}${assignment}${value}\n` : key

  this.addClientOpt = (key, value) => appendEntry(key, value, 'clientGroup')

  this.addMariadbOpt = (key, value) => appendEntry(key, value, 'mariadbGroup')

  this.build = () => `# generated on ${commons.isoDateNow()}\n\n[client]\n${text.clientGroup}\n[mariadb]\n${text.mariadbGroup}`
}

module.exports = ConfigBuilder
