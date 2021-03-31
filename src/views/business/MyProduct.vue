<template>
    <div id="MyProduct">
        <el-container>
            <el-header style="text-align: left; height: 30px; margin: 0">
                <el-button type="primary" style="margin-right: 20px"
                    @click="addProductDialogVisible = true">
                    添加产品
                </el-button>
                <el-button type="primary"
                           @click="submitProductDialogVisible = true">提交新产品</el-button>
            </el-header>
            <el-divider></el-divider>
            <el-main>

            </el-main>
        </el-container>

        <submit-product :dialog-visible="submitProductDialogVisible" @close-dialog="closeSubmitProductDialog"/>
        <add-product :dialog-visible="addProductDialogVisible" @close-dialog="closeAddProductDialog"/>
    </div>
</template>

<script>
import SubmitProduct from "@/components/business/SubmitProduct";
import AddProduct from "@/components/business/AddProduct";
export default {
    name: "MyProduct",
    components: {AddProduct, SubmitProduct},
    data() {
        return {

            submitProductDialogVisible: false,
            addProductDialogVisible: false
        }
    },
    methods: {
        closeSubmitProductDialog() {
            this.submitProductDialogVisible = false
        },
        closeAddProductDialog() {
            this.addProductDialogVisible = false
        }
    }
}
</script>

<style scoped>

</style>