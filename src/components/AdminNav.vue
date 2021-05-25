<template>
    <div id="AdminNav">
        <el-menu style="height: 100vh;" background-color="#fff" active-text-color="#409EFF">
            <el-menu-item index="1">
                <router-link :to="queryOrderPath" tag="div" slot="title">
                    <i class="el-icon-document"></i>
                    <span> 查询商户订单</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="2" v-if="isFundAdmin">
                <router-link :to="priceStaticsPath" tag="div" slot="title">
                    <i class="el-icon-data-analysis"></i>
                    <span> 统计商品价格</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="3" v-if="isQualityAdmin">
                <router-link :to="productTracePath" tag="div" slot="title">
                    <i class="el-icon-search"></i>
                    <span> 追溯商品</span>
                </router-link>
            </el-menu-item>
            <el-menu-item index="4">
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
    name: "AdminNav",
    props: ['roles'],
    data() {
        return {
            queryOrderPath: '/admin/query-order',
            priceStaticsPath: '/admin/price-statics',
            productTracePath: '/admin/product-trace',
            secretAndKeyPath: '/admin/secret-key',
        }
    },
    methods: {
        isFundAdmin() {
            if (this.roles.includes('ROLE_ADMIN_FUND')) {
                return true
            } else {
                return false
            }
        },
        isQualityAdmin() {
            if (this.roles.includes('ROLE_ADMIN_QUALITY')) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>

<style scoped>

</style>