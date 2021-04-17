<template>
    <div id="AddStock">
        <el-container v-if="needAddNewProduct">
            <el-page-header @back="goBack" content="添加商品">
            </el-page-header>
            <el-main>
                <div style="margin-top: 20px;">
                    <el-button type="text" @click="changeType" size="mini">找不到商品信息？</el-button>
                    <el-form :model="form" ref="form" :rules="rules"
                             label-position="left" :hide-required-asterisk="true" label-width="100px">
                        <el-form-item prop="product" label="请选择产品" required>
                            <el-autocomplete placeholder="选择产品" v-model="form.product"
                                             :fetch-suggestions="querySearchAsync" @select="handleSelect"
                                             @change="clear" :disabled="loading" clearable></el-autocomplete>

                        </el-form-item>
                        <el-form-item prop="name" label="产品名称">
                            <label>{{form.name}}</label>
                        </el-form-item>
                        <el-form-item prop="unit" label="单位">
                            <label>{{form.unit}}</label>
                        </el-form-item>
                        <el-form-item prop="price" label="单价" required>
                            <el-input-number v-model="form.price"
                                             :precision="2" :min="0" :step="0.01" :disabled="loading"
                                             :change="handlePriceChange">
                            </el-input-number>
                        </el-form-item>
                        <el-form-item prop="quantity" label="数量" required>
                            <el-input-number v-model="form.quantity" :precision="2"
                                             :min="0" :step="0.01" :disabled="loading"
                                             :change="handleQuantityChange"></el-input-number>
                        </el-form-item>
                    </el-form>
                </div>
            </el-main>
            <el-footer>
                <el-button type="primary" @click="goBack" :loading="loading">返回</el-button>
                <el-button type="primary" @click="submitForm('form')" :loading="loading">提交</el-button>
            </el-footer>
        </el-container>
        <submit-product v-else @go-back="changeType"></submit-product>
    </div>

</template>

<script>
import SubmitProduct from "@/components/business/SubmitProduct";
import {addStock} from "@/service/business";
import {getAllProducts} from "@/service/common";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
export default {
    name: "AddStock",
    components: {SubmitProduct},
    data() {
        var checkNumber = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("此项不能为空"))
            }
            if (parseFloat(value).toString() === 'NaN') {
                callback(new Error("请输入数字"))
            } else if (value <= 0){
                callback(new Error("此项必须大于0"))
            } else {
                callback()
            }
        }
        return {
            form: {
                product: '',
                name: '',
                unit: '',
                quantity: 0,
                price: 0,
            },
            rules: {
                product: [{required: true, trigger: 'blur', message: '请选择产品'}],
                quantity: [{validator: checkNumber, trigger: 'blur'}],
                price: [{validator: checkNumber, trigger: 'blur'}],
            },
            currentProduct: null,
            productList: null,
            loading: false,
            needAddNewProduct: true
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let form = this.form
                    this.addStock(this.currentProduct['id'], form.quantity, form.price)
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
        async addStock(productId, quantity, price) {
            this.loading = true
            let res = await addStock(productId, quantity, price)
            if (res.code === RESULT.SUCCESS) {
                message.success(res.message)
                this.clear()
                this.goBack()
            } else {
                message.error(res.message)
            }
            this.loading = false
        },
        createStateFilter(queryString) {
            return (product) => {
                return (product.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            let form = this.form
            form.name = item['name']
            form.unit = item['unit']
            this.currentProduct = item
        },
        handlePriceChange(value) {
            this.form.price = value
        },
        handleQuantityChange(value) {
            this.form.quantity = value
        },
        goBack() {
            this.$router.push('/business/my-product')
        },
        changeType() {
            this.needAddNewProduct = !this.needAddNewProduct
        },
        clear() {
            this.$refs['form'].resetFields()
            this.currentProduct = null
        },
    }
}
</script>

<style scoped>

</style>