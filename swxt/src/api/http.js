import axios from 'axios';
import env from '../../config/dev.env';
import request from './api';
import otherurl from './otherurl';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = env.NODE_ENV == "\"development\"" ? otherurl.payurl : otherurl.payurl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
/**
 * 请求配置
 */
axios.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
)
/**
 * 请求拦截
 */
// axios.interceptors.response.use(
//     response => {
//       if(response.data.errCode ==2){
//         router.push({
//           path:"/login",
//           querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
//         })
//       }
//       return response;
//     },
//     error => {
//       return Promise.reject(error)
//     }
//   )

/**
 *
 * @param {*String} url api地址
 * @param {*Object} params   参数
 */

export function ajaxGet(url, params = {}) {
  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem("user")) {
      params.token = JSON.parse(sessionStorage.getItem("user")).token;
    }
    axios.get(request[url], {
      params: params
    }).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    })
  })
}

/**
 *
 * @param {*String} url api地址
 * @param {*Object} params   参数
 */
export function ajaxPost(url, params = {}) {
  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem("user")) {
      params.token = JSON.parse(sessionStorage.getItem("user")).token;
    }
    axios({
      method: 'post',
      url: request[url],
      data: params,
      transformRequest: [function (data) {
        let ret = '';
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
        }
        return ret;
      }]
    }).then(response => {
      resolve(response);
    }).catch(err => {

      reject(err);
    });
  })
}
export default {
  axios
}
