var uid = 1

module.exports = {
  uuid: () => (++uid % 10000000).toString().padStart(6, '0') + (Math.floor(Math.random() * 8999) + 1000) + (Date.now() % 10000000),
  disableDeclaredFunctions: obj => Object.entries(obj).forEach(entry => (typeof entry[1] === 'function') && (obj[entry[0]] = () => {})),
  throwError: e => {
    throw new Error(e)
  }
}
