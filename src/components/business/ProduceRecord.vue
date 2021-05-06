<template>
    <div id="ProduceRecord">
        <el-tabs type="card">
            <el-tab-pane label="原料">
                <el-table :data="materialTableData" style="width: 90%; margin-bottom: 20px;" height="300px" border>
                    <el-table-column prop="productBatchId" label="批次号" width="200"></el-table-column>
                    <el-table-column prop="date" label="时间" width="200"></el-table-column>
                    <el-table-column prop="productQuantity" label="生产数量" width="80"></el-table-column>
                    <el-table-column prop="materialName" label="原料名称" width="80"></el-table-column>
                    <el-table-column prop="materialBatchId" label="原料批次" width="200"></el-table-column>
                    <el-table-column prop="materialQuantity" label="使用数量" width="80"></el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handleMaterialCurrentChange"
                    :current-page.sync="materialTablePage"
                    :page-size="size"
                    :total="materialTableTotalElements"
                    layout="total, prev, pager, next, jumper"
                >
                </el-pagination>
            </el-tab-pane>

            <el-tab-pane label="产品">
                <el-table :data="productTableData" style="width: 90%; margin-bottom: 20px;" height="300px" border>
                    <el-table-column prop="materialBatchId" label="批次号" width="200"></el-table-column>
                    <el-table-column prop="date" label="时间" width="200"></el-table-column>
                    <el-table-column prop="materialQuantity" label="使用数量" width="80"></el-table-column>
                    <el-table-column prop="productName" label="产品名称" width="80"></el-table-column>
                    <el-table-column prop="productBatchId" label="产品批次号" width="200"></el-table-column>
                    <el-table-column prop="productQuantity" label="生产数量" width="80"></el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handleProductCurrentChange"
                    :current-page.sync="productTablePage"
                    :page-size="size"
                    :total="productTableTotalElements"
                    layout="total, prev, pager, next, jumper"
                >
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {getMaterial} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";

const PAGE_SIZE = 10
export default {
    name: "ProduceRecord",
    props: ['productName'],
    data() {
        return {
            materialTableData: [],
            productTableData: [],
            type: '原料',
            size: PAGE_SIZE,
            materialTablePage: 1,
            materialTableTotalElements: 0,
            productTablePage: 1,
            productTableTotalElements: 0,
        }
    },
    methods: {
        async loadMaterialData(page) {
            let res = await getMaterial(page, this.size, this.productName, 1)
            if (res.code === RESULT.SUCCESS) {
                this.materialTableData = res.data['contents']
                this.materialTableTotalElements = res.data['totalElements']
            } else {
                message.error(res.message)
            }
        },
        async loadProductData(page) {
            let res = await getMaterial(page, this.size, this.productName, 0)
            if (res.code === RESULT.SUCCESS) {
                this.productTableData = res.data['contents']
                this.productTableTotalElements = res.data['totalElements']
            } else {
                message.error(res.message)
            }
        },
        handleMaterialCurrentChange(page) {
            if (page !== this.materialTablePage) {
                this.loadMaterialData(page - 1)
            }
        },
        handleProductCurrentChange(page) {
            if (page !== this.productTablePage) {
                this.loadProductData(page - 1)
            }
        },
    },
    mounted() {
        this.loadMaterialData(0)
        this.loadProductData(0)
    }
}
</script>

<style scoped>

</style>