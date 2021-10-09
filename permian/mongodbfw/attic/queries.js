function Queries() {}

Queries.createInClause = (arr, opts) => { 
  opts = Object.assign({
    caseSensitive: true,
    wholeWord: true
  }, opts)
  $in: arr.map(e => {
    var str = opts.wholeWord ? '^' + str + '$' : e
    return opts.caseSensitive ? new RegExp(str) : new RegExp(str, 'i') 
  })
}

module.exports = Object.freeze(Queries)
