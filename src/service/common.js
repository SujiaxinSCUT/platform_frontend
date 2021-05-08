import {HTTP, RESULT} from "@/utils/http";
import {getAllUsername_api, getUserDetails_api, login_api} from "@/api/common";
import {getAllProducts_api} from "@/api/common";
import {userDetailsStorage} from "@/utils/request";
import {router} from "@/router/router";

function getUserDetail() {
    let userDetails = userDetailsStorage.get()
    if (!userDetails) {
        alert("未登录或登录过期")
        router.push('/login')
    }
    return userDetails
}
export async function login(username, password, isUser) {
    const res = await login_api(username, password, isUser)
    let code
    let message
    let data
    if (res.status) {
        code = RESULT.SUCCESS
        data = res.data
        message = "登录成功"
    } else if (res.response){
        const response = res.response
        if (response.status === HTTP.BAD_CLIENT) {
            message = "用户名或密码错误"
        } else if (response.status === HTTP.BAD_SEVER) {
            message = "服务器出错，请稍后再试"
        }
        code = RESULT.FAILED
    } else {
        code = RESULT.FAILED
        message = "网络出错，请稍后再试"
    }
    return {
        code: code,
        data: data,
        message: message
    }
}

export async function getUserDetails(username) {
    const res = await getUserDetails_api(username)
    let code
    let message
    let data
    if (res.status) {
        code = RESULT.SUCCESS
        data = res.data
        message = "获取成功"
    } else if (res.response){
        const response = res.response
        if (response.status === HTTP.FORBIDDEN) {
            message = "无权限查询该用户信息"
        } else if (response.status === HTTP.NOT_FOUND) {
            message = "查无此无用户"
        }
        code = RESULT.FAILED
    } else {
        code = RESULT.FAILED
        message = "网络出错，请稍后再试"
    }
    return {
        code: code,
        data: data,
        message: message
    }
}

export async function getAllUsername() {
    let userDetails = getUserDetail()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
    const res = await getAllUsername_api()
    let code
    let message
    let data
    if (res.status) {
        code = RESULT.SUCCESS
        data = res.data
        message = "获取成功"
    } else if (res.response){
        message = "获取用户名称列表失败"
        code = RESULT.FAILED
    } else {
        code = RESULT.FAILED
        message = "网络出错，请稍后再试"
    }
    return {
        code: code,
        data: data,
        message: message
    }
}

export async function getAllProducts() {
    const res = await getAllProducts_api()
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = ""
        } else {
            code = RESULT.FAILED
            message = "获取产品列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取产品列表失败"
    } else {
        code = RESULT.FAILED
        message = "网络出错，请稍后再试"
    }
    return {
        code: code,
        message: message,
        data: res_data
    }
}

