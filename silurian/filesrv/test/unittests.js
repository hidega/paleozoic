var assert = require('assert')
var listDirectory = require('../src/list-directory')
var commons = require('../src/commons')
var parseParameters = require('../src/parse-parameters')

var caseExtractPath = () => { }

var caseListDirectoryAllowed = () => {
  var counter = 0
  var mockContextFactory = {
    emptyToBuffer: () => {
      counter++ === 0 ? null : null
      return {
        setContentType: () => ({
          setStatusCode: () => ({
            process: f => {
              result = f()
              assert(Array.isArray(result))
              assert.equal(result.length, 3)
            }
          })
        })
      }
    }
  }
  listDirectory(mockContextFactory, __dirname, true)
}

var caseListDirectoryNotAllowed = () => {
  var mockContextFactory = {
    emptyToBuffer: () => ({
      setContentType: () => ({ setStatusCode: () => ({ process: f => assert.equal(f().error, 1) }) })
    })
  }
  listDirectory(mockContextFactory, __dirname, false)
}

var caseListDirectoryError = () => {
  var counter = 0
  var mockContextFactory = {
    emptyToBuffer: () => {
      counter++ === 0 && commons.throwError(10)
      return {
        setContentType: () => ({ setStatusCode: () => ({ process: f => assert.equal(f().error, 1) }) })
      }
    }
  }
  listDirectory(mockContextFactory, __dirname, true)
}

var caseParseParameters = () => {
  var p = parseParameters()
  assert.equal(p.fileServer.allowDirectoryListing, true)
}

caseExtractPath()
caseListDirectoryAllowed()
caseListDirectoryNotAllowed()
caseListDirectoryError()
caseParseParameters()

console.log('\nOK')
