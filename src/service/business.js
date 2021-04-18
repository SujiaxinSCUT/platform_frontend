import {HTTP, RESULT} from "@/utils/http";
import {
    createOrder_api,
    submitNewProduct_api,
    addStock_api,
    getProductsInStock_api,
    getConfirmingOrder_api, getOrderPageable_api, getOrderedProductAll_api, getProductInStock_api
} from "@/api/business";
import {userDetailsStorage} from "@/utils/request";

export async function submitNewProduct(name, description, images, unit, price, quantity) {
    let userDetails = userDetailsStorage.get()
    let data = new FormData()
    data.append('name', name)
    data.append('description', description)
    data.append('unit', unit)
    data.append('submitterId', userDetails['id'])
    data.append('price', price)
    data.append('quantity', quantity)
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

export async function addStock(productId, quantity, price) {
    let userDetails = userDetailsStorage.get()
    let data = new FormData()
    data.append('productId', productId)
    data.append('quantity', quantity)
    data.append('price', price)
    data.append('accountId', userDetails['id'])
    const res = await addStock_api(data)
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

export async function getProductsInStockPageable(page, size) {
    let path = `/pageable/${page}/${size}`
    const res = await getProductsInStock_api(path)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = ""
        } else {
            code = RESULT.FAILED
            message = "获取产品列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取产品列表失败"
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

export async function getAllProductsInStock() {
    const res = await getProductsInStock_api('')
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = ""
        } else {
            code = RESULT.FAILED
            message = "获取产品列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取产品列表失败"
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

export async function createOrder(supplierName, date, products) {
    let data = {
        supplierName: supplierName,
        date: date,
        products: products
    }
    const res = await createOrder_api(data)
    let code
    let message
    let res_data
    if (res.status) {
        console.log(res)
        if (res.status === HTTP.CREATED) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = ""
        } else {
            code = RESULT.FAILED
            message = res.data
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = res.response.data
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

export async function getConfirmingOrder(page, size) {
    const res = await getConfirmingOrder_api(page, size)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = ""
        } else {
            code = RESULT.FAILED
            message = "获取待确认订单列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取待确认订单列表失败"
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

export async function getOrder(page, size, data) {
    let formData = new FormData()
    formData.append('productName', data.productName)
    if (data.startDate && data.startDate != '') {
        formData.append('startDate', data.startDate)
    }
    if (data.endDate && data.endDate != '') {
        formData.append('endDate', data.endDate)
    }
    formData.append('username', data.username)
    formData.append('salesOrder', data.salesOrder)
    const res = await getOrderPageable_api(page, size, formData)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = ""
        } else {
            code = RESULT.FAILED
            message = "获取订单列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取订单列表失败"
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

export async function getOrderedProductAll(orderId) {
    let path = `order_id/${orderId}`
    const res = await getOrderedProductAll_api(path)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = ""
        } else {
            code = RESULT.FAILED
            message = "获取商品列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取商品列表失败"
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

export async function getProductInStock(productId) {
    let path = `product_id/${productId}`
    const res = await getProductInStock_api(path)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
            message = ""
        } else {
            code = RESULT.FAILED
            message = "获取商品列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取商品列表失败"
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
