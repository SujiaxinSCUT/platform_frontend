<template>
    <el-container id="PriceStatics">
        <el-main>
            <el-form :inline="true" label-width="100px" :model="form" :rules="rules" ref="form" :hide-required-asterisk="true">
                <el-form-item prop="product" label="请选择产品" required>
                    <el-autocomplete placeholder="选择产品" v-model="form.product"
                                     :fetch-suggestions="querySearchAsync" @select="handleSelect"
                                     :disabled="loading" clearable></el-autocomplete>
                </el-form-item>

                <el-button type="primary" @click="submitForm('form')" :loading="loading">查询</el-button>
            </el-form>
            <el-divider></el-divider>
            <el-form :model="form" :inline="true" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item prop="averagePrice" label="平均价格：">
                            {{form.averagePrice}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="transNum" label="交易次数：">
                            {{form.transNum}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="tableData" style="width: 800px" height="300px">
                <el-table-column prop="orderId" label="订单号"></el-table-column>
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
import {getAvgPrice} from "@/service/admin";
const PAGE_SIZE = 5
export default {
    name: "PriceStatics",
    data() {
        var productValidator = (rule, value, callback) => {
            if (this.currentProduct == null) {
                return new callback(new Error("未选择商品"))
            }
            callback()
        }
        return {
            form: {
                product: '',
                transNum: 0,
                averagePrice: 0
            },
            rules: {
                product: [{validator: productValidator, trigger: 'blur'}],
            },
            tableData: [],
            size: PAGE_SIZE,
            currentPage: 1,
            totalElements: 0,
            currentProductName: '',
            currentProduct: null,
            loading: false
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.getAvgPrice(0)
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
                this.getAvgPrice(page - 1)
            }
        },
        async getAvgPrice(page) {
            let res = await getAvgPrice(this.currentProduct.id, page, this.size)
            if (res.code === RESULT.SUCCESS) {
                this.form.averagePrice = res.data['avgPrice']
                this.tableData = res.data['pageableResponse']['contents']
                this.totalElements = res.data['pageableResponse']['totalElements']
                this.form.transNum = res.data['pageableResponse']['totalElements']
            } else {
                message.error(res.message)
            }
        },
        handleSelect(item) {
            this.currentProduct = item
        }
    },
    mounted() {
    }
}
</script>

<style scoped>

</style>