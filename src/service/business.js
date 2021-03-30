import {HTTP, RESULT} from "@/utils/http";
import {submitNewProduct_api} from "@/api/business";
import {userDetailsStorage} from "@/utils/request";

export async function submitNewProduct(name, description, images, unit) {
    let userDetails = userDetailsStorage.get()
    let data = new FormData()
    data.append('name', name)
    data.append('description', description)
    data.append('unit', unit)
    data.append('submitterId', userDetails['id'])
    for (let i in images) {
        let image = images[i]
        data.append('images', image.raw)
    }
    const res = await submitNewProduct_api(data)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.CREATED) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = "提交成功"
        } else {
            code = RESULT.FAILED
            message = res.data
        }
    } else if (res.response){
        const response = res.response
        code = RESULT.FAILED
        message = response.data
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