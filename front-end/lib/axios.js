import axios from 'axios'
import qs from 'qs'

const instance = axios.create({
    baseURL: process.env.AXIOS_BASE_URL || '',
    paramsSerializer: function(params) {
        return qs.stringify(params)
    },
})

instance.defaults.headers.patch['Content-Type'] = 'application/json'

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
    // console.log(typeof window === 'undefined' ? 'Server!!' : 'Client!!')
    // console.log('#setAuth', access_token)
    if (access_token) {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
    } else if (access_token === null) {
        delete instance.defaults.headers.common['Authorization']
    }
}
