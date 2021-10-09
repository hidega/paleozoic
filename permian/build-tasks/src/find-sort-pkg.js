module.exports = (files, pkgName, suffix) => files.filter(e => e.startsWith(pkgName) && e.endsWith(suffix))
  .map(e => ({ filename: e, mark: e.replace(pkgName, '') }))
  .map(e => {
    e.mark = e.mark.replace('.tgz', '')
    return e
  })
  .map(e => {
    var verNrs = e.mark.split('.')
    verNrs[0] = verNrs[0].padStart(5, 0)
    verNrs[1] = verNrs[1].padStart(5, 0)
    verNrs[2] = verNrs[2].padStart(5, 0)
    e.mark = Number(verNrs.join(''))
    return e
  })
  .sort((a, b) => a.mark > b.mark ? 1 : -1)
  .map(e => e.filename)
