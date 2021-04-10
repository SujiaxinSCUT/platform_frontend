<template>
    <div id="OrderDetails">
        <el-container>
            <el-main>
                <order-detail v-for="(product, index) in productList" :index="index"
                              :product="product" :key="index">

                </order-detail>

            </el-main>
        </el-container>

    </div>
</template>

<script>
import OrderDetail from "@/components/business/OrderDetail";
export default {
    name: "OrderDetails",
    components: {OrderDetail},
    data() {
        return {
            productList: [],
        }
    },
    methods: {

    }
}
</script>

<style scoped>

</style>