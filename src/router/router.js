import VueRouter from "vue-router"
import Login from "@/views/login/Login";
import Business from "@/views/business/Business";
import Admin from "@/views/admin/Admin";
import {ACCESS_TOKEN} from "@/utils/request";
import BasicView from "@/components/BasicView";


const routes = [
    {path: '/', meta: {requireAuth: true}},
    {path: '/login', component: Login},
    {path: '/business', component: Business, meta: { requireAuth: true }},
    {path: '/admin', component: Admin, meta: { requireAuth: true }},
    {path: '/basic', component: BasicView}
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    if (to.matched.some((auth) => auth.meta.requireAuth)) {
        let token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            next();
        } else {
            next({
                path: "/login"
            })
            if (from.path !== '/') {
                alert("未登录或认证过期")
            }
        }
    } else {
        next();
    }
})

export { router }