<template>
    <div id="BusinessNav">
        <el-menu style="height: 100vh;" background-color="#fff" active-text-color="#409EFF">
            <el-menu-item index="1">
                <router-link :to="myProductPath" tag="div" slot="title">
                    <i class="el-icon-goods"></i>
                    <span> 我的产品</span>
                </router-link>
            </el-menu-item>
            <el-submenu index="2">
                <span slot="title">
                   <i class="el-icon-s-order"></i>
                    订单管理
                </span>
                <el-menu-item-group>
                    <el-menu-item index="2-1">
                        <router-link :to="submitPurchaseOrderPath" tag="div" slot="title">
                            <span>创建订单</span>
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="2-2">
                        <router-link :to="submitSalesOrderPath" tag="div" slot="title">
                            <span>核对订单</span>
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="2-3">
                        <router-link :to="historyOrderPath" tag="div" slot="title">
                            <span>历史订单</span>
                        </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="3">
                <router-link :to="secretAndKeyPath" tag="div" slot="title">
                    <i class="el-icon-key"></i>
                    <span> 证书管理</span>
                </router-link>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: "BusinessNav",
    data() {
        return {
            myProductPath: '/business/my-product',
            submitSalesOrderPath: '/business/submit-sales-order',
            submitPurchaseOrderPath: '/business/submit-purchasing-order',
            historyOrderPath: '/business/my-order',
            secretAndKeyPath: '/business/secret-key'
        }
    }
}
</script>

<style scoped>

</style>