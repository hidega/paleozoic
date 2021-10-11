module.exports = (t, c, f) => {
  var result
  if (!c || typeof c !== 'function') {
    try {
      result = t()
    } catch (e) {
      result = c
    }
  } else if (f) {
    var err = {}
    try {
      result = t()
    } catch (e) {
      result = c(e)
      e !== undefined && (err.val = e)
    } finally {
      result = f(result, err)
    }
  } else {
    try {
      result = t()
    } catch (e) {
      result = c(e)
    }
  }
  return result
}
