var commons = require('..')

var script = `#!/bin/bash
  echo "Hello world!"
`

commons.executeScriptAsFileInTempdir(script)
  .then(() => console.log('OK'))
  .catch(e => console.error('ERROR\n', e) || process.exit(1))