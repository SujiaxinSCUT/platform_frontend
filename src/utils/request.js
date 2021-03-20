import axios from "axios";

export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

const service = axios.create({
    timeout:5000,
})

service.interceptors.request.use(
    config => {
        if (localStorage.getItem(ACCESS_TOKEN)) {
            config.headers['Authorization'] = `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` || ''
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

service.interceptors.response.use(
    res => {
        //TODO
        return Promise.resolve(res)
    },
    error => {
        return Promise.reject(error)
    }
)

export default service