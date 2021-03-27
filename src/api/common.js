import {post, get} from "@/utils/http";
import qs from "querystring";
const {LOGIN, GET_USER_DETAILS} = require("@/utils/url")

export function login_api(username, password, isUser) {
    let url = LOGIN
    const data = {
        username: username,
        password: password,
        grant_type: 'password',
        scope: 'select',
        client_id: isUser ? 'client_user' : 'client_admin',
        client_secret: 'platform'
    }
    return post(url, qs.stringify(data))
}

export function getUserDetails_api(username) {
    const url = `${GET_USER_DETAILS}/${username}`
    return get(url)
}