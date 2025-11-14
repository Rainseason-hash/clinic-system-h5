import axios from 'axios'
import {ElMessage} from 'element-plus'
const request=axios.create({
  baseURL:'https://v3pz.itndedu.com/v3pz',
  timeout:10000
})
//请求拦截器
request.interceptors.request.use(function (config){
  console.log(config)
  //发送请求之前做些什么
  const token= localStorage.getItem('token') 
  //不需要添加token的api
  const whiteUrl=['/get/code','/user/authentication','/login']
  //如果token存在，并且不在白名单中，则添加token
  if(token && !whiteUrl.includes(config.url)){
      config.headers['x-token']=token
  }
   return config
}, function (error) {
  //对请求错误做些什么
  return Promise.reject(error)
})
//响应拦截器
request.interceptors.response.use(function (response){
  //对响应数据做点什么
  if(response.data.code===-1){
    ElMessage.warning(response.data.message)
  }
  //token过期有问题
  if(response.data.code===-2){
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('clinic')
    window.location.href=window.location.origin//当前页面的路由
  }
  return response
}, function (error) {
  //对响应错误做点什么
  return Promise.reject(error)
})
export default request