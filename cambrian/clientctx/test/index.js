var WebClientContext = require('..')

var start = ctx => {
  var root = ctx.getDocument().getElementById('pageroot')
  var mainElement = ctx.tools.divBuilder()
    .setTextContent('Furulya')
    .build()
  root.appendChild(mainElement)
  console.log('OK\n')
}

/* global window */ 

WebClientContext.create()
  .then(start)
  .catch(err => console.log('ERROR:\n', err))
