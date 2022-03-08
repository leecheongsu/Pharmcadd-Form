import axios from 'axios'
import qs from 'qs'

const instance = axios.create({
    baseURL: process.env.AXIOS_BASE_URL || '',
    paramsSerializer: function(params) {
        return qs.stringify(params)
    },
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin,X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version',
    },
})

// 요청 인터셉터 추가
instance.interceptors.request.use(config => {
    return config
})

// 응답 인터셉터 추가
instance.interceptors.response.use(res => {
        // 응답 데이터를 가공
        return res
    },
    error => {
        // 오류 응답을 처리
        console.log(error.data)
        /* TODO: Error Handler */
        return Promise.reject(error)
    })

export default instance

export const setAuth = (access_token) => {
    if (access_token) {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
    } else {
        delete instance.defaults.headers.common['Authorization']
    }
}
