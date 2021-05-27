<template>
    <el-container id="QueryUserOrder">
        <el-main>
            <el-form :inline="true" :model="form" :rules="rules" ref="form" :hide-required-asterisk="true">
                <el-form-item prop="username" label="商户名称"  required>
                    <el-autocomplete placeholder="选择商户" v-model="form.username"
                                     :fetch-suggestions="querySearchAsync" :disabled="loading" clearable></el-autocomplete>
                </el-form-item>

                <el-button type="primary" @click="submitForm('form')" :loading="loading">查询</el-button>
            </el-form>
            <el-divider></el-divider>
            <el-table :data="tableData" style="width: 800px" height="350px">
                <el-table-column prop="id" label="订单号"></el-table-column>
                <el-table-column prop="date" label="交易时间"></el-table-column>
                <el-table-column label="订单状态">
                    <el-tag slot-scope="scope" :type="statusMapping[tableData[scope.$index]['status']].type" size="small">
                        {{statusMapping[tableData[scope.$index]['status']].value}}
                    </el-tag>
                </el-table-column>
                <el-table-column label="订单类型">
                    <span slot-scope="scope">
                        {{currentUsername == tableData[scope.$index]['clientName'] ? '进货订单' : '销售订单'}}
                    </span>
                </el-table-column>
                <el-table-column label="交易方名称">
                    <span slot-scope="scope">
                        {{currentUsername == tableData[scope.$index]['clientName'] ?
                        tableData[scope.$index]['supplierName'] : tableData[scope.$index]['clientName']}}
                    </span>
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
</template>

<script>
import {getAllUsername} from "@/service/common";
import {getOrderPageable} from "@/service/admin";
const {ORDER_STATUS_MAPPING} = require("@/utils/status")
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
const PAGE_SIZE = 10
export default {
    name: "QueryUserOrder",
    data() {
        return {
            form: {
                username: ''
            },
            usernames: [],
            loading: false,
            tableData: [],
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
            currentUsername: '',
            rules: {
                username: [{required: true, trigger: 'blur', message: '请选择用户名称'}],
            },
            statusMapping: ORDER_STATUS_MAPPING
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
        handleCurrentChange(page) {
            if (page !== this.currentPage) {
                this.getOrders(this.currentUsername, page - 1, this.size)
            }
        },
        async querySearchAsync(queryString, cb) {
            if (!this.productList) {
                await this.getUsernames()
            }
            let usernames = this.usernames ? this.usernames : []
            let results = queryString ? usernames.filter(this.createStateFilter(queryString)) : usernames
            let newResults = []
            for (let i in results) {
                let result = results[i]
                newResults.push({value: result})
            }
            cb(newResults)
        },
        async getUsernames() {
            let res = await getAllUsername()
            if (res.code === RESULT.SUCCESS) {
                this.usernames = res.data
            } else {
                message.error(res.message)
            }
        },
        createStateFilter(queryString) {
            return (product) => {
                return (product.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        async getOrders(username, page, size) {
            this.loading = true
            const res = await getOrderPageable(username, page, size)
            if (res.code === RESULT.SUCCESS) {
                this.currentUsername = username
                this.tableData = res.data['contents']
                this.totalElements = res.data['totalElements']
            } else {
                message.error(res.message)
            }
            this.loading = false
        }
    }
}
</script>

<style scoped>

</style>