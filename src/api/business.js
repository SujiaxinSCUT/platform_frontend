// import qs from "querystring";
import {post} from "@/utils/http";
const {SUBMIT_NEW_PRODUCT} = require('@/utils/url')

export function submitNewProduct_api(data) {
    let url = SUBMIT_NEW_PRODUCT
    return post(url, data)
}