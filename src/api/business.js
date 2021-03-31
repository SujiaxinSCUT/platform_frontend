// import qs from "querystring";
import {get, post} from "@/utils/http";
import {ADD_STOCK, GET_ALL_PRODUCTS} from "@/utils/url";
const {SUBMIT_NEW_PRODUCT} = require('@/utils/url')

export function submitNewProduct_api(data) {
    let url = SUBMIT_NEW_PRODUCT
    return post(url, data)
}

export function getAllProducts_api() {
    let url = GET_ALL_PRODUCTS
    return get(url)
}

export function addStock_api(data) {
    let url = ADD_STOCK
    return post(url, data)
}