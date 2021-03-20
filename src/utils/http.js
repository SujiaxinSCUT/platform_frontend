import request from './request'

export const HOST = 'http://localhost:81/'

export const HTTP = {
    OK: 200,
    BAD_CLIENT: 400,
    BAD_SEVER: 500
}

export function post(url, data, opt) {
    return request({...{
        url: url,
        method: 'post',
        data: data,
    }, ...opt})
}

export function get(url, data, opt) {
    return request({...{
            url: url,
            method: 'get',
            data: data
        }, ...opt})
}

export function put(url, data, opt) {
    return request({...{
            url: url,
            method: 'put',
            data: data
        }, ...opt})
}