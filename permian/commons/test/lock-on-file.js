const files = require('../src/files')
const pid = process.pid
const lockfileNameA = './lockfile-a.tmp'
const lockfileNameB = './lockfile-b.tmp'

try {
  files.acquireLockfile(lockfileNameB)
  .then(fd => {
    process.send(`process ${pid} opened ${lockfileNameB}`)
    setTimeout(retval => retval.release() , 5000)
  })
  .catch(e => process.send(`process ${pid} failed to acquire lock ${lockfileNameB}: ${e}`))

  files.acquireLockfile(lockfileNameA, (err, release, fd) => {
    if(err) {
      process.send(`process ${pid} failed to acquire lock ${lockfileNameA}: ${err}`)
    } else {
      process.send(`process ${pid} opened ${lockfileNameA}`)
      setTimeout(() => release(() => {}), 5000)
    }
  })
} catch(e) {
  process.send(`ERROR ${e}`)
}