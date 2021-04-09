<template>
    <div id="CheckOrder">
        <el-container>
            <el-main>
                <el-table :data="tableData" style="width: 600px">
                    <el-table-column
                        prop="orderId"
                        label="订单号"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="clientName"
                        label="客户名称"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="transactionDatetime"
                        label="交易时间"
                        width="140">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"
                        width="100">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="handleDesView(scope.$index, scope.row)" type="text">核对信息</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "CheckOrder",
    data() {
        return {
            tableData: [],

        }
    }
}
</script>

<style scoped>

</style>