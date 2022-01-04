var axios = require('axios')

var axiosInstance = axios.create({
  baseURL: 'http://localhost:9000/api/v1/'
})

module.exports = axiosInstance