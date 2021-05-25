
import {HTTP, RESULT} from "@/utils/http";
import {getOrdersPageable_api, traceProduct_api} from "@/api/admin";
import {userDetailsStorage} from "@/utils/request";
import {router} from "@/router/router";

function getUserDetails() {
    let userDetails = userDetailsStorage.get()
    if (!userDetails) {
        alert("未登录或登录过期")
        router.push('/login')
    }
    return userDetails
}
export async function getOrderPageable(username, page, size) {
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
    let path = `username/${username}/pageable/${page}/${size}`
    const res = await getOrdersPageable_api(path)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = '查询失败'
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

export async function trace(batchId, isBack) {
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
    let clientKey = localStorage.getItem("keyFileOf" + userDetails['name'])
    let clientCrt = localStorage.getItem("crtFileOf" + userDetails['name'])
    if (!clientKey || clientKey.replace(/^\s+|\s+$/g,"") == '') {
        router.push('/business/secret-key')
        return {
            code: RESULT.FAILED,
            message: '未上传密钥',
            data: null
        }
    }
    if (!clientCrt || clientCrt.replace(/^\s+|\s+$/g,"") == '') {
        router.push('/business/secret-key')
        return {
            code: RESULT.FAILED,
            message: '未上传证书',
            data: null
        }
    }

    let data = {
        isBack: isBack,
        batchId: batchId,
        clientKey: clientKey,
        clientCrt: clientCrt
    }

    const res = await traceProduct_api(data)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
        } else if (res.status === HTTP.NOT_FOUND) {
            code = RESULT.FAILED
            message = "批次号不存在"
        } else {
            code = RESULT.FAILED
            message = "查询失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = '查询失败'
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