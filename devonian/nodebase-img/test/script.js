var crypto = require('crypto')

crypto.getCiphers()

for(var i=0; i<10; i++) {
  console.log('Hello World', i)
}

if(process.env.FOO !== 'foo') {
  process.exit(1)
}

process.exit(0)