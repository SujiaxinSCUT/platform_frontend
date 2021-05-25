import {ORDERS_ADMIN} from "@/utils/url";
import {get, post} from "@/utils/http";

export function getOrdersPageable_api(path) {
    let url = ORDERS_ADMIN + '/' + path
    return get(url)
}

export function traceProduct_api(data) {
    let url = ORDERS_ADMIN + '/trace'
    return post(url, data)
}