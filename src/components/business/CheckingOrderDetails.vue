<template>
    <div id="CheckingOrderDetails">
        <el-container>
            <el-page-header @back="goBack" content="详情页面">
            </el-page-header>
            <el-main>
                <checking-order-detail v-for="(product, index) in productList" :index="index"
                              :product="product" :key="index" @update-batch="updateBatch">
                </checking-order-detail>
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
import {getOrderedProductAll} from "@/service/business";
import {message} from "ant-design-vue";
import {RESULT} from "@/utils/http";
import CheckingOrderDetail from "@/components/business/CheckingOrderDetail";
export default {
    name: "CheckingOrderDetails",
    components: {CheckingOrderDetail},
    props: [],
    data() {
        return {
            productList: [

            ],
            orderId: this.$route.params.orderId
        }
    },
    methods: {
        goBack() {
            this.$router.push('/business/my-order')
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
        },
        async loadProductList() {
            let res = await getOrderedProductAll(this.orderId)
            if (res.code === RESULT.SUCCESS) {
                this.productList = res.data
            } else {
                message.error(res.message)
            }
        }
    },
    mounted() {
        console.log(this.orderId)
        this.loadProductList()
    }
}
</script>

<style scoped>

</style>