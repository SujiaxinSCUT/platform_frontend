import {HTTP, RESULT} from "@/utils/http";
import {getUserDetails_api, login_api} from "@/api/common";

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

