<template>
    <div id="TransactionRecord">
        <el-radio-group v-model="type">
            <el-radio-button label="销售记录"></el-radio-button>
            <el-radio-button label="购买记录"></el-radio-button>
        </el-radio-group>
                <el-table :data="tableData" style="width: 90%;margin-top: 20px;margin-bottom: 20px;" height="300px" border>
                    <el-table-column prop="orderId" label="订单号" width="100"></el-table-column>
                    <el-table-column prop="date" label="交易时间"></el-table-column>
                    <el-table-column prop="username" :label="username" width="100"></el-table-column>
                    <el-table-column prop="status" label="订单状态" width="100">
                        <el-tag slot-scope="scope" :type="statusMapping[tableData[scope.$index]['status']].type" size="small">
                            {{statusMapping[tableData[scope.$index]['status']].value}}
                        </el-tag>
                    </el-table-column>
                    <el-table-column label="订单详情" width="100"></el-table-column>
                </el-table>
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="size"
            :total="totalElements"
            layout="total, prev, pager, next, jumper"
        >
        </el-pagination>
    </div>
</template>

<script>
import {getOrder} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
const {ORDER_STATUS_MAPPING} = require("@/utils/status")
const PAGE_SIZE = 10
export default {
    name: "TransactionRecord",
    props: ['productName'],
    data() {
        return {
            type: '销售记录',
            tableData: [],
            username: this.type === '销售记录' ? '客户名称' : '供货商名称',
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
            statusMapping: ORDER_STATUS_MAPPING,
        }
    },
    methods: {
        async loadData(page) {
            let post_data = {
                productName: this.productName,
                startDate: '',
                endDate: '',
                username: '',
                salesOrder: this.type === "销售记录" ? true : false
            }
            let res = await getOrder(page, this.size, post_data)
            if (res.code === RESULT.SUCCESS) {
                let data = res.data['contents']
                this.totalElements = res.data['totalElements']
                this.tableData = []
                for (let i in data) {
                    let item = data[i]
                    this.tableData.push({
                        orderId: item['id'],
                        username: post_data.salesOrder ? item['clientName'] : item['supplierName'],
                        date: item['date'],
                        status: item['status']
                    })
                }
            } else {
                message.error(res.message)
            }
        },
        handleCurrentChange(page) {
            if (page !== this.currentPage) {
                this.loadTableData(page - 1)
            }
        },
    },
    watch: {
        type(oldVal, newVal) {
            this.username = newVal === '销售记录' ? '客户名称' : '供货商名称'
            this.loadData(0)
        }
    },
    mounted() {
        this.loadData(0)
    }
}
</script>

<style scoped>

</style>