<template>
    <el-container id="PriceStatics">
        <el-main>
            <el-form :inline="true" label-width="100px" :model="form" :rules="rules" ref="form" :hide-required-asterisk="true">
                <el-form-item prop="product" label="请选择产品" required>
                    <el-autocomplete placeholder="选择产品" v-model="form.product"
                                     :fetch-suggestions="querySearchAsync"
                                     :disabled="loading" clearable></el-autocomplete>
                </el-form-item>

                <el-button type="primary" @click="submitForm('form')" :loading="loading">查询</el-button>
            </el-form>
            <el-divider></el-divider>
            <el-form :model="form" :inline="true" label-width="100px">
                <el-form-item prop="averagePrice" label="平均价格：">
                    {{form.averagePrice}}
                </el-form-item>
                <el-form-item prop="unit" label="单位：">
                    {{form.unit}}
                </el-form-item>
            </el-form>
            <el-table :data="tableData" style="width: 800px">
                <el-table-column prop="id" label="订单号"></el-table-column>
                <el-table-column prop="date" label="交易时间"></el-table-column>
                <el-table-column prop="price" label="单价">
                </el-table-column>
                <el-table-column prop="quantity" label="数量">
                </el-table-column>
                <el-table-column prop="supplierName" label="供货商">
                </el-table-column>
                <el-table-column prop="clientName" label="客户">
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
import {getAllProducts} from "@/service/common";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
const PAGE_SIZE = 10
export default {
    name: "PriceStatics",
    data() {
        return {
            form: {
                product: '',
                unit: '',
                averagePrice: 0
            },
            rules: {
                product: [{required: true, trigger: 'blur', message: '请选择商品名称'}],
            },
            tableData: [],
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
            currentProductName: '',
            loading: false
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.getOrders(this.form.product, 0, this.size)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        async querySearchAsync(queryString, cb) {
            if (!this.productList) {
                await this.getProductList()
            }
            let productList = this.productList ? this.productList : []
            let results = queryString ? productList.filter(this.createStateFilter(queryString)) : productList
            for (let i in results) {
                let result = results[i]
                result['value'] = `${result.name}(${result.description})`
            }
            cb(results)
        },
        async getProductList() {
            let res = await getAllProducts()
            if (res.code === RESULT.SUCCESS) {
                this.productList = res.data
            } else {
                message.error(res.message)
            }
        },
        createStateFilter(queryString) {
            return (product) => {
                return (product.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleCurrentChange(page) {
            if (page !== this.currentPage) {
                this.getOrders(this.currentProductName, page, this.size)
            }
        },
        async getOrders(productName, page, size) {
            console.log(productName + ' ' + page + ' ' + size)
        }
    },
    mounted() {
    }
}
</script>

<style scoped>

</style>