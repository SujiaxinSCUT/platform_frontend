<template>
    <div id="MyProduct">
        <el-container>
            <el-header style="text-align: left; height: 30px; margin: 0">
                <el-button type="primary" style="margin-right: 20px"
                    @click="addProductDialogVisible = true">
                    添加产品
                </el-button>
                <el-button type="primary"
                           @click="submitProductDialogVisible = true">提交新产品</el-button>
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
                    <el-table-column label="描述">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="handleDesView(scope.$index, scope.row)" type="text">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sum"
                        label="数量">
                    </el-table-column>
                    <el-table-column
                        label="来源">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="handleSourceView(scope.$index, scope.row)" type="text">查看</el-button>
                        </template>
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

        <submit-product :dialog-visible="submitProductDialogVisible" @close-dialog="closeSubmitProductDialog"/>
        <add-product :dialog-visible="addProductDialogVisible" :parent-type="PARENT_TYPE.MY_PRODUCT" @close-dialog="closeAddProductDialog"/>
    </div>
</template>

<script>
import SubmitProduct from "@/components/business/SubmitProduct";
import AddProduct from "@/components/business/AddProduct";
import {getProductsInStockPageable} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue"
const {PARENT_TYPE} = require('@/utils/business_const');
const PAGE_SIZE = 10

export default {
    name: "MyProduct",
    components: {AddProduct, SubmitProduct},
    data() {
        return {
            tableData: null,
            submitProductDialogVisible: false,
            addProductDialogVisible: false,
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
            PARENT_TYPE
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
        handleDesView(index, row) {
            console.log(index + ' ' + row)
        },
        handleSourceView(index, row) {
            console.log(index + ' ' + row)
        },
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