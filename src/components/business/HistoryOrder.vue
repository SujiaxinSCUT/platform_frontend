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
                        <span> - </span>
                        <el-date-picker
                            v-model="form.endDate"
                            type="datetime"
                            placeholder="截止日期"
                            @change="loadData(0)">
                        </el-date-picker>
                    </el-form-item>

                </el-form>
                <el-form :inline="true" :model="form" label-width="100px">
                    <el-form-item prop="username" :label="usernameLabel">
                        <el-input v-model="form.username" @change="loadData(0)"></el-input>
                    </el-form-item>
                    <el-form-item prop="type" style="margin-left: 30px">
                        <el-radio v-model="type" label="1" @change="loadData(0)">销售订单</el-radio>
                        <el-radio v-model="type" label="2" @change="loadData(0)">进货订单</el-radio>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <el-table :data="tableData" style="width: 800px" height="400">
                    <el-table-column prop="orderId" label="订单号"></el-table-column>
                    <el-table-column prop="date" label="交易时间"></el-table-column>
                    <el-table-column prop="type" label="订单类型"></el-table-column>
                    <el-table-column prop="username" :label="usernameLabel"></el-table-column>
                    <el-table-column prop="status" label="订单状态">
                        <el-tag slot-scope="scope" :type="statusMapping[tableData[scope.$index]['status']].type" size="small">
                            {{statusMapping[tableData[scope.$index]['status']].value}}
                        </el-tag>
                    </el-table-column>
                    <el-table-column label="交易产品">
                        <el-popover placement="right" trigger="click" slot-scope="scope">
                            <el-table :data="tempTableData" :max-height="400">
                                <el-table-column prop="name" label="产品名称" width="80"></el-table-column>
                                <el-table-column prop="unit" label="单位" width="80"></el-table-column>
                                <el-table-column prop="price" label="单价" width="80"></el-table-column>
                                <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
                            </el-table>
                            <el-button slot="reference" type="text" size="mini"
                                       @click="getOrderedProduct(tableData[scope.$index]['orderId'])">
                                查看</el-button>
                        </el-popover>
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
import {getOrder, getOrderedProductAll} from "@/service/business";
import {RESULT} from "@/utils/http";
const {ORDER_STATUS_MAPPING} = require("@/utils/status")
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

            },
            tableData: [],
            type: '2',
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
            statusMapping: ORDER_STATUS_MAPPING,
            tempTableData: [],
            usernameLabel: this.type === '1' ? '客户名称' : '供应商名称',
        }
    },
    methods: {
        async loadData(page) {
            let post_data = {
                productName: this.form.productName,
                startDate: this.form.startDate,
                endDate: this.form.endDate,
                username: this.form.username,
                salesOrder: this.type === "1" ? true : false
            }
            let res = await getOrder(page, this.size, post_data)
            if (res.code === RESULT.SUCCESS) {
                let data = res.data['contents']
                this.totalElements = res.data['totalElements']
                this.tableData = []
                console.log(data)
                for (let i in data) {
                    let item = data[i]
                    this.tableData.push({
                        orderId: item['id'],
                        username: this.type === "1" ? item['clientName'] : item['supplierName'],
                        date: item['date'],
                        status: item['status'],
                        type: this.type === "1" ? "销售订单" : "进货订单"
                    })
                }
                console.log(this.tableData)
            } else {
                message.error(res.message)
            }
        },
        handleCurrentChange(page) {
            if (page !== this.currentPage) {
                this.loadTableData(page - 1)
            }
        },
        async getOrderedProduct(orderId) {
            this.tempTableData = []
            const res = await getOrderedProductAll(orderId)
            if (res.code === RESULT.SUCCESS) {
                this.tempTableData = res.data
            } else {
                message.error(res.message)
            }
        },

    },
    mounted() {
        this.loadData(0)
    },
    watch: {
        type(newVal) {
            this.usernameLabel = newVal == '1' ? '客户名称' : '供应商名称'
        }
    }
}
</script>

<style scoped>

</style>