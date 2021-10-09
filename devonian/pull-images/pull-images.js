var pullImages = require('.')

pullImages.pullConsole()
  .then(() => console.log('Success'))
  .catch(e => console.error('ERROR\n', e))