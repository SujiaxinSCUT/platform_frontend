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
                            <router-link :to="orderDetailsPath" tag="div" slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="handleOrderDetails(scope.$index, tableData)" type="text">核对信息</el-button>
                            </router-link>
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
            tableData: [
                {
                    orderId: 1,
                    clientName: 'user2',
                    transactionDatetime: new Date(),
                    status: '待确认',
                }
            ],
            orderDetailsPath: '/business/order-details'
        }
    },
    methods: {
        handleOrderDetails() {

        }
    }
}
</script>

<style scoped>

</style>