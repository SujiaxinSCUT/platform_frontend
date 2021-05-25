const BASE_URL = 'http://localhost:81'
// common url

export const LOGIN = `${BASE_URL}/oauth/token`
export const GET_USER_DETAILS = `${BASE_URL}/trace/account/user_details`
export const ACCOUNT = `${BASE_URL}/trace/account`

export const PRODUCT = `${BASE_URL}/trace/product`
export const GET_ALL_PRODUCTS = `${BASE_URL}/trace/product/all`
export const STOCK = `${BASE_URL}/trace/business/stock`
export const SAVE_STOCK = `${BASE_URL}/trace/business/stock/save`
export const MATERIAL_STOCK = `${BASE_URL}/trace/business/stock/material`

export const ORDER = `${BASE_URL}/trace/business/order`
export const GET_CONFIRMING_ORDER = `${BASE_URL}/trace/business/order/confirming`

export const ORDERS_ADMIN = `${BASE_URL}/trace/admin/order`