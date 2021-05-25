<template>
    <el-container id="PersonalOrders">
        <el-main>
            <el-divider content-position="left">商户订单信息</el-divider>
            <el-row :gutter="20" style="margin-bottom: 60px;margin-top: 40px;">
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{totalOrderNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">总订单数</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{onTransOrderNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">交易中订单</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{checkingOrderNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">待处理订单</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{invalidOrderNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">无效订单</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-divider content-position="left">更多信息</el-divider>
            <el-row :gutter="30" style="margin-top: 40px;">
                <el-col :span="12">
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>最近5项订单</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="toHistoryOrder">查询订单</el-button>
                        </div>
                        <el-table :data="recentOrderTable" height="300">
                            <el-table-column prop="id" label="订单号" width="80"></el-table-column>
                            <el-table-column prop="date" label="交易时间" width="150"></el-table-column>
                            <el-table-column prop="type" label="类型" width="80"></el-table-column>
                            <el-table-column prop="username" label="对方名称" width="80"></el-table-column>
                            <el-table-column prop="status" label="状态"  width="80">
                                <el-tag slot-scope="scope" :type="statusMapping[recentOrderTable[scope.$index]['status']].type" size="small">
                                    {{statusMapping[recentOrderTable[scope.$index]['status']].value}}
                                </el-tag>
                            </el-table-column>
                            <el-table-column label="详情"  width="80">

                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>待处理订单</span>
                        </div>
                        <el-table :data="checkingOrderTable" height="300">
                            <el-table-column
                                prop="id"
                                label="订单号"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="clientName"
                                label="客户名称"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                label="状态"
                                width="100">
                                <el-tag slot-scope="scope" :type="statusMapping[checkingOrderTable[scope.$index]['status']].type" size="small">
                                    {{statusMapping[checkingOrderTable[scope.$index]['status']].value}}
                                </el-tag>
                            </el-table-column>
                            <el-table-column prop="date" label="交易时间" width="150"></el-table-column>
                            <el-table-column label="操作">
                                <router-link tag="div"
                                             slot-scope="scope"
                                             :to="'/business/order-details/' + checkingOrderTable[scope.$index]['id']">
                                    <el-button
                                        size="mini" type="text">
                                        核对信息
                                    </el-button>
                                </router-link>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import {ORDER_STATUS_MAPPING} from "@/utils/status";
import {getPersonalOrders} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
import {userDetailsStorage} from "@/utils/request";

export default {
    name: "PersonalOrders",
    data() {
        return {
            totalOrderNum: 0,
            onTransOrderNum: 0,
            checkingOrderNum: 0,
            invalidOrderNum: 0,
            statusMapping: ORDER_STATUS_MAPPING,
            recentOrderTable: [],
            checkingOrderTable: [],

            selfName: userDetailsStorage.get().name
        }
    },
    methods: {
        async getPersonalOrders() {
            let res = await getPersonalOrders()
            console.log(res)
            if (res.code === RESULT.SUCCESS) {
                this.totalOrderNum = res.data['totalOrderNum']
                this.onTransOrderNum = res.data['checkingOrderNum']
                this.checkingOrderNum = res.data['confirmingOrderNum']
                this.invalidOrderNum = res.data['invalidOrderNum']
                this.checkingOrderTable = res.data['confirmingOrders']


                let orders = res.data['recentOrders']
                this.recentOrderTable = []
                for (let i in orders) {
                    let order = orders[i]
                    this.recentOrderTable.push({
                        id: order['id'],
                        date: order['date'],
                        username: order['supplierName'] === this.selfName ? order['clientName'] : order['supplierName'],
                        type: order['supplierName'] === this.selfName ? '销售订单' : '进货订单',
                        status: order['status']
                    })
                }
            } else {
               message.error(res.message)
            }
        },
        toHistoryOrder() {
            this.$router.push('/business/history-order')
        }
    },
    mounted() {
        this.getPersonalOrders()
    }
}
</script>

<style scoped>

</style>