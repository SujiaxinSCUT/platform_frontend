<template>
    <div id="HistoryOrder">
        <el-container>
            <el-main>
                <el-form :inline="true" :model="form" label-width="100px">
                    <el-form-item prop="productName" label="产品名称">
                        <el-input v-model="form.productName" @change="loadData(0)"></el-input>
                    </el-form-item>
                    <el-form-item  label="交易时间">
                        <el-date-picker
                            v-model="form.startDate"
                            type="datetime"
                            placeholder="开始日期"
                            @change="loadData(0)">
                        </el-date-picker>
                        <el-date-picker
                            v-model="form.endDate"
                            type="datetime"
                            placeholder="截止日期"
                            @change="loadData(0)">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="username" label="交易方名称">
                        <el-input v-model="form.username" @change="loadData(0)"></el-input>
                    </el-form-item>
                    <el-form-item prop="type" style="margin-left: 30px">
                            <el-radio v-model="form.type" label="1" @change="loadData(0)">销售订单</el-radio>
                            <el-radio v-model="form.type" label="2" @change="loadData(0)">进货订单</el-radio>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <el-table :data="tableData" style="width: 800px" height="400">
                    <el-table-column prop="orderId" label="订单号"></el-table-column>
                    <el-table-column prop="date" label="交易时间"></el-table-column>
                    <el-table-column prop="type" label="订单类型"></el-table-column>
                    <el-table-column prop="username" label="交易方名称"></el-table-column>
                    <el-table-column prop="status" label="订单状态">
                        <span slot-scope="scope">
                            {{statusMapping[tableData[scope.$index]['status']]}}
                        </span>
                    </el-table-column>
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
import {getOrder} from "@/service/business";
import {RESULT} from "@/utils/http";
const {STATUS_MAPPING} = require("@/model/OrderStatus")
import {message} from "ant-design-vue";

const PAGE_SIZE = 10
export default {
    name: "HistoryOrder",
    data() {
        return {
            form: {
                productName: '',
                startDate: '',
                endDate: '',
                username: '',
                type: '2'
            },
            tableData: [],
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
            statusMapping: STATUS_MAPPING
        }
    },
    methods: {
        async loadData(page) {
            let post_data = {
                productName: this.form.productName,
                startDate: this.form.startDate,
                endDate: this.form.endDate,
                username: this.form.username,
                salesOrder: this.form.type === "1" ? true : false
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
                        username: data.sales_order ? item['clientName'] : item['supplierName'],
                        date: item['date'],
                        status: item['status'],
                        type: data.sales_order ? "销售订单" : "进货订单"
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
    mounted() {
        this.loadData(0)
    }
}
</script>

<style scoped>

</style>