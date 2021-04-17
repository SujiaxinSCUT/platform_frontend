import {GET_ORDERS} from "@/utils/url";
import {get} from "@/utils/http";

export function getOrdersPageable_api(path) {
    let url = GET_ORDERS + '/' + path
    return get(url)
}