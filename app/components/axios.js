import config from '../config/constants'
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

var CPAxios=axios.create({
  baseURL: config.API_HOST,
});
CPAxios.interceptors.request.use(function (config) {
  return AsyncStorage.getItem('id_token').then(accessToken=>{
    if (accessToken !== null && accessToken !== undefined && accessToken != 'null') {
      if (config.method !== 'OPTIONS') {
        accessToken = accessToken.replace(/^"(.*)"$/, '$1');
        config.headers.authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  });
}, function (error) {
   return Promise.reject(error);
});
CPAxios.interceptors.response.use(function (response) {
  var resData=response.data;
  if(resData && resData.response && resData.response.token){
    return AsyncStorage.setItem('id_token', resData.response.token).then(_=>{ return response});
  }
  return response;
}, function (error) {
  console.log(error, error.response.status);
  if(error.response.status === 401){
    return AsyncStorage.removeItem('id_token').then(_=>{
      return Promise.reject(error);
    })
  }
  return Promise.reject(error);
});
export default CPAxios;