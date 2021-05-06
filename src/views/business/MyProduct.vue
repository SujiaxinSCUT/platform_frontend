<template>
    <div id="MyProduct">
        <el-container>
            <el-header style="text-align: left; height: 30px; margin: 0">
                <router-link :to="addStockPath">
                    <el-button type="primary" style="margin-right: 20px">
                        添加商品
                    </el-button>
                </router-link>
            </el-header>
            <el-divider></el-divider>
            <el-main>
                <el-table
                    :data="tableData"
                    style="width: 700px;margin-top: -20px" height="480">
                    <el-table-column
                        prop="name"
                        label="产品名称"
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
                                       @click="goToProductDetails(tableData[scope.$index])">
                                查看</el-button>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <el-pagination
                    @size-change="handleSizeChange"
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
import {getProductsInStockPageable, getProductInStock} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue"
const {PARENT_TYPE} = require('@/utils/business_const');
const PAGE_SIZE = 10

export default {
    name: "MyProduct",
    components: {},
    data() {
        return {
            productDetailsPath: '/business/product-details',
            addStockPath: '/business/add-stock',
            tableData: null,
            submitProductDialogVisible: false,
            addProductDialogVisible: false,
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
            PARENT_TYPE,
            tempTableData: []
        }
    },
    methods: {
        closeSubmitProductDialog() {
            this.submitProductDialogVisible = false
        },
        closeAddProductDialog() {
            this.addProductDialogVisible = false
        },
        handleCurrentChange(page) {
            if (page !== this.currentPage) {
                this.loadTableData(page - 1)
            }
        },
        async loadTableData(page) {
            const res = await getProductsInStockPageable(page, this.size)
            if (res.code === RESULT.SUCCESS) {
                this.tableData = res.data['contents']
                this.totalElements = res.data['totalElements']
            } else {
                message.error(res.message)
            }
        },
        handleSizeChange(val) {
            console.log(val)
        },
        async getProductInStock(productId) {
            this.tempTableData = []
            const res = await getProductInStock(productId)
            if (res.code === RESULT.SUCCESS) {
                this.tempTableData = res.data
            } else {
                message.error(res.message)
            }
        },
        goToProductDetails(product) {
            console.log(product)
            this.$router.push({name: 'product-details',
                query: {
                    productName: product['name'],
                    productId: product['id'],
                    productUnit: product['unit'],
                    productSum: product['sum']
            }})
        }
    },
    computed: {
    },
    mounted() {
        this.loadTableData(0)
    },
}
</script>

<style scoped>

</style>