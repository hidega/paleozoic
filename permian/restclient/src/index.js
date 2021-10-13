var axios = require('axios')

module.exports = {
  newInstance: parameters => axios(parameters)
}
