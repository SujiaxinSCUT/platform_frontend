<template>
    <div id="OrderDetails">
        <el-container>
            <el-page-header @back="goBack" content="详情页面">
            </el-page-header>
            <el-main>
                <order-detail v-for="(product, index) in productList" :index="index"
                              :product="product" :key="index" @update-batch="updateBatch">
                </order-detail>
            </el-main>
            <el-footer>
                <el-button type="primary" @click="goBack">返回</el-button>
                <el-button type="primary" @click="submit">确认订单并提交</el-button>
                <el-button type="danger">订单信息有误</el-button>
            </el-footer>
        </el-container>

    </div>
</template>

<script>
import OrderDetail from "@/components/business/OrderDetail";
import {message} from "ant-design-vue";
export default {
    name: "OrderDetails",
    components: {OrderDetail},
    data() {
        return {
            productList: [
                {
                    name: 'ipad',
                    unit: 'kg',
                    price: 1000,
                    quantity: 1,

                },
                {
                    name: 'ipad',
                    unit: 'kg',
                    price: 1000,
                    quantity: 1,

                }
            ],
        }
    },
    methods: {
        goBack() {
            this.$router.push('/business/submit-sales-order')
        },
        updateBatch(data) {
            this.productList[data['index']]['batch'] = data['batch']
        },
        submit() {
            if (!this.checkBatch()) {
                message.error("选择批次数目有误")
            }
        },
        checkBatch() {
            let productList = this.productList
            for(let i in productList) {
                let product = productList[i]
                let num = 0
                for (let j in product['batch']) {
                    num += product['batch'][j]['transactionNumber']
                }
                if (product['quantity'] !== num) {
                    return false
                }
            }
            return true
        }
    }
}
</script>

<style scoped>

</style>