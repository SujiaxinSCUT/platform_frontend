<template>
    <el-container id="PersonalProducts">
        <el-main>
            <el-divider content-position="left">库存商品信息</el-divider>
            <el-row :gutter="20" style="margin-bottom: 60px;margin-top: 40px;">
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{totalProductNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">商品种类</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{totalBatchNum}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">库存批次数量</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{transactionBatch}}</span>
                        </div>
                        <div>
                            <span style="font-size: 6px;color: #A9A9A9">交易批次</span>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card style="text-align: center">
                        <div>
                            <span style="font-size: 36px; font-weight: bold">{{produceBatch}}</span>
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
                            <span>库存产品</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="toAddStock">添加库存</el-button>
                        </div>
                        <el-table
                            :data="productTable"  height="300">
                            <el-table-column
                                prop="name"
                                label="商品名称"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="unit"
                                label="单位"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="sum"
                                label="数量">
                            </el-table-column>
                            <el-table-column
                                label="明细">
                                <el-button type="text" size="mini" slot-scope="scope"
                                           @click="goToProductDetails(productTable[scope.$index])">
                                    查看</el-button>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            style="margin-top: 10px;"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="size"
                            :total="totalProductNum"
                            layout="total, prev, pager, next, jumper"
                        >
                        </el-pagination>
                    </el-card>
                </el-col>
                <el-col :span="12">

                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>最近入库</span>
                        </div>
                        <el-table :data="recentStockTable" height="340">
                            <el-table-column prop="batchId" label="批次号" width="200"></el-table-column>
                            <el-table-column prop="date" label="时间" width="200"></el-table-column>
                            <el-table-column prop="restQuantity" label="数量" width="80"></el-table-column>
                            <el-table-column prop="status" label="状态"  width="80">
                                <el-tag slot-scope="scope" :type="mapping[recentStockTable[scope.$index]['status']].type" size="small">
                                    {{mapping[recentStockTable[scope.$index]['status']].value}}
                                </el-tag>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import {STOCK_STATUS_MAPPING} from "@/utils/status";
import {getPersonalStock, getProductsInStockPageable} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
const PAGE_SIZE = 5
export default {
    name: "PersonalProducts",
    data() {
        return {
            productTable: [],
            recentStockTable: [],

            totalProductNum: 0,
            totalBatchNum: 0,
            transactionBatch: 0,
            produceBatch: 0,

            mapping: STOCK_STATUS_MAPPING,
            size: PAGE_SIZE,
            currentPage: 1,
        }
    },
    methods: {
        goToProductDetails(product) {
            this.$router.push({name: 'product-details',
                query: {
                    productName: product['name'],
                    productId: product['id'],
                    productUnit: product['unit'],
                    productSum: product['sum']
                }})
        },
        toAddStock() {
            this.$router.push('/business/add-stock')
        },
        handleCurrentChange(page) {
            if (page !== this.currentPage) {
                this.loadRecentStockTableData(page - 1)
            }
        },
        async loadRecentStockTableData(page) {
            const res = await getProductsInStockPageable(page, this.size)
            if (res.code === RESULT.SUCCESS) {
                this.recentStockTable = res.data['contents']
                this.totalProductNum = res.data['totalElements']
            } else {
                message.error(res.message)
            }
        },
        async loadPersonalStock() {
            const res = await getPersonalStock()
            if (res.code === RESULT.SUCCESS) {
                let data = res['data']
                this.totalBatchNum = data['totalBatchNum']
                this.produceBatch = data['produceBatch']
                this.totalProductNum = data['productsResponse']['totalElements']
                this.transactionBatch = data['transactionBatch']
                this.productTable = data['productsResponse']['contents']
                this.recentStockTable = data['recentStock']
            } else {
                message.error(res.message)
            }
        }
    },
    mounted() {
        this.loadPersonalStock()
    }
}
</script>

<style scoped>

</style>