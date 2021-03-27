import request from './request'

export const HTTP = {
    OK: 200,
    BAD_CLIENT: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    BAD_SEVER: 500
}

export const RESULT = {
    SUCCESS: 1,
    FAILED: 0
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