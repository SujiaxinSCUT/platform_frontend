import {post, HOST} from "@/utils/http"
import qs from 'querystring'

const API = 'oauth/token'

export async function login(username, password, isUser) {
    const url = HOST + API
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
