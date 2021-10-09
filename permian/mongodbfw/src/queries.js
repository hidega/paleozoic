var createInClause = (arr, o) => { 
  var opts = Object.assign({
    caseSensitive: true,
    wholeWord: true
  }, o)
  return ({
    $in: arr.map(e => {
      var str = opts.wholeWord ? '^' + str + '$' : e
      return opts.caseSensitive ? new RegExp(str) : new RegExp(str, 'i') 
    })
  })
}

module.exports = Object.freeze({
  createInClause
})
