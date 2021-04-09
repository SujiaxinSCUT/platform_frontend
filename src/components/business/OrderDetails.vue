<template>
    <div id="OrderDetails">
        <el-container>
            <el-main>
                <el-card v-for="(index, product) in productList" :key="index">
                    <el-form :inline="true" :label-width="100">
                        <el-form-item label="产品名称:">
                            {{product.name}}
                        </el-form-item>
                        <el-form-item label="单位:">
                            {{product.unit}}
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" :label-width="100">
                        <el-form-item label="单价:">
                            {{product.price}}
                        </el-form-item>
                        <el-form-item label="数量:">
                            {{product.quantity}}
                        </el-form-item>
                    </el-form>

                </el-card>
            </el-main>
        </el-container>

    </div>
</template>

<script>
export default {
    name: "OrderDetails",
    data() {
        return {
            productList: []
        }
    }
}
</script>

<style scoped>

</style>