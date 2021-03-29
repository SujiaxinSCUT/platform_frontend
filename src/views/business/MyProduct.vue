<template>
    <div id="MyProduct">
        <el-container>
            <el-header style="text-align: left; height: 30px; margin: 0">
                <el-button type="primary" style="margin-right: 20px"
                    @click="submitProductDialogVisible = true">
                    添加产品
                </el-button>
                <el-button type="primary">提交新产品</el-button>
            </el-header>
            <el-divider></el-divider>
            <el-main>

            </el-main>
        </el-container>

        <submit-product :dialog-visible="submitProductDialogVisible" @close-dialog="closeSubmitProductDialog"/>
    </div>
</template>

<script>
import SubmitProduct from "@/components/business/SubmitProduct";
export default {
    name: "MyProduct",
    components: {SubmitProduct},
    data() {
        return {

            submitProductDialogVisible: false
        }
    },
    methods: {
        closeSubmitProductDialog() {
            this.submitProductDialogVisible = false
        }
    }
}
</script>

<style scoped>

</style>