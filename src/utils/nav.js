export const navList = {
    businessNavList: [
        {
            name: "我的产品",
            hasChildren: false,
            icon: 'el-icon-goods',
            route: {
                path: "/business/my-product",
            }
        },
        {
            name: "订单管理",
            hasChildren: true,
            icon: 'el-icon-document',
            children: [
                {
                    name: "提交销售订单",
                    route: {
                        path: "/business/submit-sales-order",
                    }
                },
                {
                    name: "提交进货订单",
                    route: {
                        path: "/business/submit-purchasing-order",
                    }
                },
                {
                    name: "历史订单",
                    route: {
                        path: "/business/my-order",
                    }
                }
            ]
        },

    ],
    adminNavList: [
        {
            name: "查询订单",
            hasChildren: false,
            route: {
                path: "/business/query-order",
            },
            accessRoles: [
                "ROLE_ADMIN_FUND",
                "ROLE_ADMIN_QUALITY"
            ]
        },
        {
            name: "统计价格",
            hasChildren: false,
            route: {
                path: "/business/price-statics",
            },
            accessRoles: [
                "ROLE_ADMIN_FUND"
            ]
        },
        {
            name: "追溯产品",
            hasChildren: false,
            route: {
                path: "/business/product-trace",
            },
            accessRoles: [
                "ROLE_ADMIN_QUALITY"
            ]
        }
    ]
}