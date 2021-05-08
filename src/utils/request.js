import axios from "axios";
import {ExpiresStorage} from "@/model/ExpireStorage";


export const userDetailsStorage = new ExpiresStorage("user_details")

const service = axios.create({
    timeout:5000,
})

service.interceptors.request.use(
    config => {
        let userDetails = userDetailsStorage.get()
        if (userDetails) {
            config.headers['Authorization'] = `Bearer ${userDetails['access_token']}` || ''

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
        return Promise.resolve(error)
    }
)

export default service