<template>
    <div id="SubmitOrder">
        <el-container>
            <el-header style="text-align: left; height: 30px; margin: 0">
                <el-button type="primary" style="margin-right: 20px"
                           @click="addProductDialogVisible = true">
                    添加产品
                </el-button>
            </el-header>
            <el-divider></el-divider>
            <el-main></el-main>
            <el-footer></el-footer>
        </el-container>
        <add-product :dialog-visible="addProductDialogVisible" :parent-type="parentType" @close-dialog="closeAddProductDialog"/>
    </div>
</template>

<script>
import AddProduct from "@/components/business/AddProduct";
const {PARENT_TYPE} = require('@/utils/business_const');
export default {
    name: "SubmitOrder",
    components: {AddProduct},
    props: ['isSalesOrder'],
    data() {
        return {
            parentType: this.isSalesOrder ? PARENT_TYPE.SUBMIT_SALES_ORDER : PARENT_TYPE.SUBMIT_PURCHASE_ORDER,
            addProductDialogVisible: false
        }
    },
    methods: {
        closeAddProductDialog() {
            this.addProductDialogVisible = false
        }
    }
}
</script>

<style scoped>

</style>