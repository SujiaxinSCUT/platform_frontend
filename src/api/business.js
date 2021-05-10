// import qs from "querystring";
import {get, post} from "@/utils/http";
import {ORDER, STOCK, GET_CONFIRMING_ORDER, SAVE_STOCK, MATERIAL_STOCK} from "@/utils/url";
const {SUBMIT_NEW_PRODUCT} = require('@/utils/url')

export function submitNewProduct_api(data) {
    let url = SUBMIT_NEW_PRODUCT
    return post(url, data)
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

export function getOrderPageable_api(page, size, data) {
    let url = `${ORDER}/pageable/${page}/${size}`
    return post(url, data)
}

export function getOrderedProductAll_api(path) {
    let url = `${ORDER}/${path}`
    return get(url)
}

export function getProductInStock_api(path) {
    let url = `${STOCK}/${path}`
    return get(url)
}

export function saveStock_api(data) {
    let url = SAVE_STOCK
    return post(url, data)
}

export function getMaterial_api(path) {
    let url = `${MATERIAL_STOCK}/${path}`
    return get(url)
}

export function getStockPageable_api(path) {
    let url = `${STOCK}/${path}`
    return get(url)
}

export function getPersonalOrders_api() {
    let url = `${ORDER}/personal`
    return get(url)
}

