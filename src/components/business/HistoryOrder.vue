<template>
    <div id="HistoryOrder">
        <el-container>
            <el-main>
                <el-form :inline="true" :model="form" label-width="100px">
                    <el-form-item prop="productName" label="产品名称">
                        <el-input v-model="form.productName"></el-input>
                    </el-form-item>
                    <el-form-item prop="date" label="交易时间">
                        <el-date-picker
                            v-model="form.date"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="username" label="交易方名称">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="type" style="margin-left: 30px">
                        <el-radio-group v-model="form.type">
                            <el-radio label="销售订单"></el-radio>
                            <el-radio label="进货订单"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <el-table :data="tableData" style="width: 800px" height="400">
                    <el-table-column prop="orderId" label="订单号"></el-table-column>
                    <el-table-column prop="date" label="交易时间"></el-table-column>
                    <el-table-column prop="type" label="订单类型"></el-table-column>
                    <el-table-column prop="username" label="交易方名称"></el-table-column>
                    <el-table-column label="交易产品"></el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="size"
                    :total="totalElements"
                    layout="total, prev, pager, next, jumper"
                >
                </el-pagination>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
const PAGE_SIZE = 10
export default {
    name: "HistoryOrder",
    data() {
        return {
            form: {
                productName: '',
                date: ['', ''],
                username: '',
                type: ''
            },
            tableData: [],
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
        }
    },
    methods: {
        handleCurrentChange() {

        }
    }
}
</script>

<style scoped>

</style>