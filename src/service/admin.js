
import {HTTP, RESULT} from "@/utils/http";
import {getOrdersPageable_api} from "@/api/admin";
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