<template>
    <div id="ProductDetails">
            <el-page-header @back="goBack" content="详情页面"></el-page-header>
                <el-tabs type="border-card" style="width: 80%;margin-top: 30px;">
                    <el-tab-pane label="基础信息" style="height: 500px; padding-top: 20px; padding-left: 40px;">
                        <el-form :model="form" ref="form"  :inline="true"
                                 label-position="left" :hide-required-asterisk="true" label-width="90px" style="width: 80%">
                            <el-form-item prop="name" label="产品名称">
                                <div style="width: 60px;">{{form.name}}</div>
                            </el-form-item>
                            <el-form-item prop="unit" label="单位" style="position: relative;left: 40%;">
                                <label>{{form.unit}}</label>
                            </el-form-item>
                        </el-form>
                        <el-form :model="form" ref="form" :inline="true"
                                 label-position="left" :hide-required-asterisk="true" label-width="90px" style="width: 80%">
                            <el-form-item prop="sum" label="数量">
                                <div style="width: 60px;">{{form.sum}}</div>
                            </el-form-item>
                            <el-form-item prop="batchNum" label="批次数量" style="position: relative;left: 40%;">
                                <label>{{totalElements}}</label>
                            </el-form-item>
                        </el-form>
                        <el-form :model="form" ref="form" :inline="true"
                                 label-position="left" :hide-required-asterisk="true" label-width="90px" style="width: 80%;">
                            <el-form-item prop="batchList" label="批次记录">
                                <el-table :data="form.batchList" border height="300px">
                                    <el-table-column prop="batchId" label="批次号" width="200"></el-table-column>
                                    <el-table-column prop="date" label="进货时间" width="200"></el-table-column>
                                    <el-table-column prop="quantity" label="余量" width="80"></el-table-column>
                                    <el-table-column prop="status" label="状态" width="80">
                                        <el-tag slot-scope="scope" :type="mapping[form.batchList[scope.$index]['status']].type" size="small">
                                            {{mapping[form.batchList[scope.$index]['status']].value}}
                                        </el-tag>
                                    </el-table-column>
                                </el-table>
                                <el-pagination
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="currentPage"
                                    :page-size="size"
                                    :total="totalElements"
                                    layout="total, prev, pager, next, jumper"
                                    style="margin-top: 20px;"
                                >
                                </el-pagination>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="生产记录" style="height:500px; padding-top: 20px; padding-left: 40px;">
                        <produce-record :product-name="form.name">
                        </produce-record>
                    </el-tab-pane>
                    <el-tab-pane label="交易记录" style="height:500px; padding-top: 20px; padding-left: 40px;">
                        <transaction-record :product-name="form.name"></transaction-record>
                    </el-tab-pane>
                </el-tabs>
    </div>

</template>

<script>
import ProduceRecord from "@/components/business/ProduceRecord";
import TransactionRecord from "@/components/business/TransactionRecord";
import {getStockOfProductPageable} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
import {STOCK_STATUS_MAPPING} from "@/utils/status";

const PAGE_SIZE = 5
export default {
    name: "ProductDetails",
    components: {TransactionRecord, ProduceRecord},
    props: [],
    data() {
        return {
            form: {
                name: this.$route.query.productName,
                unit: this.$route.query.productUnit,
                sum: 0,

                batchList: []
            },
            productId: this.$route.query.productId,
            size: PAGE_SIZE,
            totalElements: 0,
            currentPage: 1,
            mapping: STOCK_STATUS_MAPPING
        }
    },
    methods: {
        goBack() {
            this.$router.push('/business/my-product')
        },
        async loadTable(page) {
            let res = await getStockOfProductPageable(this.productId, page, this.size)
            if (res.code === RESULT.SUCCESS) {
                this.form.batchList = res.data['contents']
                this.totalElements = res.data['totalElements']
                this.form.sum = 0
                for (let i in this.form.batchList) {
                    let batch = this.form.batchList[i]
                    if (batch['status'] === 'free' || batch['status'] === 'on_transaction') {
                        this.form.sum += batch['quantity']
                    }
                }
            } else {
                message.error(res.message)
            }
        },
        handleCurrentChange(page) {
            if (page !== this.currentPage) {
                this.loadTable(page - 1)
            }
        },
    },
    mounted() {
        this.loadTable(0)
    },
    watch: {
    }
}
</script>

<style scoped>

</style>