import VueRouter from "vue-router"
import Login from "@/views/login/Login";
import Business from "@/views/business/Business";
import Admin from "@/views/admin/Admin";
import {userDetailsStorage} from "@/utils/request";
import MyProduct from "@/views/business/MyProduct";
import SubmitSalesOrder from "@/views/business/SubmitSalesOrder";
import SubmitPurchaseOrder from "@/views/business/SubmitPurchaseOrder";
import CheckingOrderDetails from "@/components/business/CheckingOrderDetails";
import MyOrder from "@/views/business/MyOrder";
import AddStock from "@/components/business/AddStock";
import QueryUserOrder from "@/views/admin/QueryUserOrder";
import PriceStatics from "@/views/admin/PriceStatics";
import ProductTrace from "@/views/admin/ProductTrace";
import ProductDetails from "@/components/business/ProductDetails";
import UploadView from "@/components/UploadView";
import PersonalOrders from "@/components/business/PersonalOrders";



const routes = [
    {path: '/', meta: {requireAuth: true}},
    {path: '/login', component: Login},
    {
        path: '/business',
        component: Business,
        meta: { requireAuth: true },
        children: [
            {
                path: "my-order",
                meta: {
                    requireAuth: true
                },
                component: PersonalOrders
            },
            {
                path: "my-product",
                meta: {
                    requireAuth: true
                },
                component: MyProduct
            },
            {
                path: "add-stock",
                meta: {
                    requireAuth: true
                },
                component: AddStock
            },
            {
                path: "submit-sales-order",
                meta: {
                    requireAuth: true
                },
                component: SubmitSalesOrder
            },
            {
                path: "order-details/:orderId",
                meta: {
                    requireAuth: true
                },
                component: CheckingOrderDetails
            },
            {
                path: "submit-purchasing-order",
                meta: {
                    requireAuth: true
                },
                component: SubmitPurchaseOrder
            },
            {
                path: "history-order",
                meta: {
                    requireAuth: true
                },
                component: MyOrder
            },
            {
                path: "product-details",
                name: "product-details",
                meta: {
                    requireAuth: true
                },
                component: ProductDetails
            },
            {
                path: "secret-key",
                meta: {
                    requireAuth: true
                },
                component: UploadView
            }
        ]
    },
    {
        path: '/admin',
        component: Admin,
        meta: { requireAuth: true },
        children: [
            {
                path: "query-order",
                meta: {
                    requireAuth: true
                },
                component: QueryUserOrder
            },{
                path: "price-statics",
                meta: {
                    requireAuth: true
                },
                component: PriceStatics
            },
            {
                path: "product-trace",
                meta: {
                    requireAuth: true
                },
                component: ProductTrace
            },
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    if (to.matched.some((auth) => auth.meta.requireAuth)) {
        let userDetails = userDetailsStorage.get()
        if (userDetails) {
            if (to.path === '/') {
                if (userDetails['user_type'] === 'business') {
                    next({
                        path: "/business"
                    })
                } else {
                    next({
                        path: "/admin"
                    })
                }
            }
            let path = to.path.toString().split('/')[1]
            if (!pathMatch(path, userDetails['user_type'])) {
                next({
                    path: "/login"
                })
                alert("无权限访问此页面")
            }
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

function pathMatch(path, user_type) {
    let business_path = [
        'business',
        'my-product',
        'submit-sales-order',
        'my-order'
    ]
    let admin_path = [
        'admin',
        'query-order',
        'price-statics',
        'product-trace'
    ]
    if ((user_type === 'business' && business_path.includes(path))
        || (user_type === 'admin' && admin_path.includes(path))) {
        return true
    }
    return false
}


export { router }