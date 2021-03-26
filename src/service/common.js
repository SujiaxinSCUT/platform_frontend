import {post} from "@/utils/http"
import qs from 'querystring'
import {GET_USER_DETAILS, LOGIN} from "@/utils/url";

export async function login(username, password, isUser) {
    const url = LOGIN
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

export async function getUserDetails(username) {
    const url = GET_USER_DETAILS + '/' + username
    return post(url)
}
