import axios from 'axios'
const request = axios.create({
  baseURL: typeof window == "undefined" ? 'http://127.0.0.1:8082':''
})
request.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  console.log(error)
})

export default request