// import qs from "querystring";
import {get, post} from "@/utils/http";
import {ORDER, STOCK, GET_ALL_PRODUCTS, GET_CONFIRMING_ORDER} from "@/utils/url";
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
    let url = STOCK
    return post(url, data)
}

export function getProductsInStock_api(path) {
    let url = STOCK + path
    return get(url)
}

export function createOrder_api(data) {
    let url = ORDER
    return post(url, data)
}

export function getConfirmingOrder_api(page, size) {
    let url = `${GET_CONFIRMING_ORDER}/pageable/${page}/${size}`
    return get(url)
}

export function getOrderPageable(page, size, data) {
    let url = `${ORDER}/pageable/${page}/${size}`
    return post(url, data)
}