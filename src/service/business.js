import {HTTP, RESULT} from "@/utils/http";
import {
    createOrder_api,
    submitNewProduct_api,
    addStock_api,
    getProductsInStock_api,
    getConfirmingOrder_api,
    getOrderPageable_api,
    getOrderedProductAll_api,
    getProductInStock_api,
    saveStock_api,
    getMaterial_api, getStockPageable_api
} from "@/api/business";
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

export async function submitNewProduct(name, description, images, unit, price, quantity) {
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
    let data = new FormData()
    data.append('name', name)
    data.append('description', description)
    data.append('unit', unit)
    data.append('submitterId', userDetails['name'])
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
        if (res.status === HTTP.OK) {
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

export async function addStock(productId, quantity, price, unit) {
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
    let data = new FormData()
    data.append('productId', productId)
    data.append('quantity', quantity)
    data.append('price', price)
    data.append('accountName', userDetails['name'])
    data.append('unit', unit)
    const res = await addStock_api(data)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
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
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
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

export async function getAllProductsInStock(accountName) {
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
    let path = `/account_name/${accountName}`
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

export async function getProductsInStock(productId) {
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
    const res = await getProductsInStock_api(`/product_id/${productId}`)
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
            message = "获取批次列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取批次列表失败"
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

export async function createOrder(supplierName, products) {
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
    let privateKey = localStorage.getItem("pemFileOf" + userDetails['name'])
    if (!privateKey || privateKey.replace(/^\s+|\s+$/g,"") == '') {
        router.push('/business/secret-key')
        return {
            code: RESULT.FAILED,
            message: '未上传私钥',
            data: null
        }
    }
    let data = {
        supplierName: supplierName,
        privateKey: privateKey,
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
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
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
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
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
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
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
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
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

export async function saveStock(stock, batchList, productName, unit) {
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
        stock: stock,
        batchList: batchList,
        productName: productName,
        unit: unit,
        clientKey: clientKey,
        clientCrt: clientCrt
    }

    const res = await saveStock_api(data)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
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

export async function getMaterial(page, size, productName, type) {
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
    let path = `product_name/${productName}/type/${type}/pageable/${page}/${size}`
    const res = await getMaterial_api(path)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
        } else {
            code = RESULT.FAILED
            message = "获取失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取失败"
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


export async function getStockOfProductPageable(productId, page, size) {
    let userDetails = getUserDetails()
    if (!userDetails) {
        return {
            code: RESULT.FAILED,
            message: '登录过期',
            data: null
        }
    }
    let path = `product_id/${productId}/pageable/${page}/${size}`
    const res = await getStockPageable_api(path)
    let code
    let message
    let res_data
    if (res.status) {
        if (res.status === HTTP.OK) {
            code = RESULT.SUCCESS
            res_data = res.data
        } else {
            code = RESULT.FAILED
            message = "获取批次列表失败"
        }
    } else if (res.response){
        code = RESULT.FAILED
        message = "获取批次列表失败"
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