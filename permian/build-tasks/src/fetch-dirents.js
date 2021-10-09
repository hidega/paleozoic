var fs = require('fs')
var path = require('path')

var fetchDirents = dir => new Promise((resolve, reject) => {
  var filelist = []
  var counter = 1

  var traverse = d => fs.readdir(d, { withFileTypes: true }, (err, dirents) => {
    try {
      err || dirents.forEach(de => { 
        var fullFileName = path.resolve(d, de.name)

        var push = () => filelist.push({
          isFile: () => de.isFile(),
          isDirectory: () => de.isDirectory(),
          name: fullFileName
        })

        if(de.isDirectory()) {
          push(de)
          counter++
          setImmediate(() => traverse(fullFileName))
        } else if(de.isFile()) {
          push(de)
        }
      }) 

      --counter === 0 && resolve(filelist)
    } catch(e) {
      reject(e)
    }
  }) 
   
  traverse(dir)
})

module.exports = fetchDirents
