<template>
    <el-container id="PersonalProducts">
        <el-main>
            <el-divider content-position="left">库存产品信息</el-divider>
            <el-row :gutter="20" style="margin-bottom: 60px;margin-top: 40px;">
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{totalOrderNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">产品种类</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{onTransOrderNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">库存批次总量</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{checkingOrderNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">交易获取批次</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{invalidOrderNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">生产批次</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-divider content-position="left">更多库存信息</el-divider>
            <el-row :gutter="30" style="margin-top: 40px;">
                <el-col :span="12">
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>最近入库批次</span>
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
                            <span>库存产品列表</span>
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
export default {
name: "PersonalProducts"
}
</script>

<style scoped>

</style>