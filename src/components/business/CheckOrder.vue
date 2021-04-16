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
                            <router-link tag="div"
                                         slot-scope="scope"
                                         :to="'/business/order-details/' + tableData[scope.$index]['orderId']">
                                <el-button
                                    size="mini" type="text">
                                    核对信息
                                </el-button>
                            </router-link>
                    </el-table-column>
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
import {getConfirmingOrder} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";

const PAGE_SIZE = 10
export default {
    name: "CheckOrder",
    data() {
        return {
            tableData: [
            ],
            orderDetailsPath: '/business/order-details',
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
        }
    },
    methods: {
        async loadData(page) {
            let res = await getConfirmingOrder(page, this.size)
            if (res.code === RESULT.SUCCESS) {
                let data = res.data['contents']
                this.totalElements = res.data['totalElements']
                for (let i in data) {
                    let item = data[i]
                    this.tableData.push({
                        orderId: item['id'],
                        clientName: item['clientName'],
                        transactionDatetime: item['date'],
                        status: '待确认',
                    })
                }
            } else {
                message.error(res.message)
            }
        },
        handleOrderDetails(index, rows) {
            this.$router.push({path: '/business/order-details/' + rows[index]['orderId']})
        },
        handleCurrentChange(page) {
            if (page !== this.currentPage) {
                this.loadTableData(page - 1)
            }
        },
    },
    mounted() {
        this.loadData(0)
    }
}
</script>

<style scoped>

</style>