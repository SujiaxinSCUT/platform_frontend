<template>
    <el-container id="ProductTrace">
        <el-main>
            <el-form :inline="true" :model="form" :rules="rules" ref="form" :hide-required-asterisk="true">
                <el-form-item prop="batchId" label="批次号"  required>
                    <el-input v-model="form.batchId"></el-input>
                </el-form-item>

                <el-button type="primary" @click="submitForm('form')" :loading="loading">查询</el-button>
            </el-form>
            <el-divider></el-divider>
            <el-table :data="tableData" style="width: 800px">
                <el-table-column prop="id" label="订单号"></el-table-column>
                <el-table-column prop="date" label="交易时间"></el-table-column>
                <el-table-column prop="price" label="单价">

                </el-table-column>
                <el-table-column prop="quantity" label="数量">

                </el-table-column>
                <el-table-column prop="clientName" label="客户">

                </el-table-column>
                <el-table-column prop="supplierName" label="供货商">

                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>

        </el-footer>
    </el-container>
</template>

<script>
export default {
    name: "ProductTrace",
    data() {
        return {
            form: {
                batchId: ''
            },
            currentUsername: '',
            rules: {
                batchId: [{required: true, trigger: 'blur', message: '请填写批次号'}],
            },
            tableData: [],
            loading: false
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.getOrders(this.form.username, 0, this.size)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
    }
}
</script>

<style scoped>

</style>