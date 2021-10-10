var ElementBuilder = require('./element-builder')
var commons = require('./commons')

function InputBuilder(window) {
  var types = ['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week']

  this.setType = type => {
    types.includes(type) || commons.throwError('Bad input type ' + type)
    this.setAttribute('type', type)
    return this
  }

  this.setChildren = () => commons.throwError('Do not add children to an input')

  ElementBuilder.call(this, window, 'input')
}

var getTools = window => ({
  jsonToCss: json => Object.keys(json).map(k => k + ': ' + json[k] + ';').join('\n'),
  divBuilder: () => new ElementBuilder(window, 'div'),
  inputBuilder: () => new InputBuilder(window),
  spanBuilder: () => new ElementBuilder(window, 'span')
})

module.exports = window => getTools(window)
