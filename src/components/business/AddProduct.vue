<template>
    <el-dialog id="AddProduct" :visible.sync="dialogVisible" style="" title="添加产品" :before-close="close"
               width="500px" :center="true" :modal="false">
        <el-form :model="form" ref="form" :rules="rules"
                 label-position="left" :hide-required-asterisk="true" label-width="100px" size="medium">
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
        <div slot="footer" style="margin-top: -20px">
            <el-button type="primary" @click="submitForm('form')" :loading="loading">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {getAllProducts, addStock} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue"
const {PARENT_TYPE} = require("@/utils/business_const")

export default {
    name: "AddProduct",
    props: ['dialogVisible', 'parentType'],
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
            PARENT_TYPE
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.parentType === PARENT_TYPE.MY_PRODUCT) {
                        let form = this.form
                        this.addStock(this.currentProduct['id'], form.quantity, form.price)
                    } else {
                        this.addProductInOrder()
                        this.close()
                        this.clear()
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        close() {
            this.$emit('close-dialog')
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
                this.close()
                this.clear()
            } else {
                message.error(res.message)
            }
            this.loading = false
        },
        addProductInOrder() {
            let data = {
                product: this.currentProduct,
                quantity: this.form.quantity,
                price: this.form.price
            }
            this.$emit('add-product-item', data)
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
        clear() {
            this.$refs['form'].resetFields()
            this.currentProduct = null
        },
        handlePriceChange(value) {
            this.form.price = value
        },
        handleQuantityChange(value) {
            this.form.quantity = value
        },
    },
    mounted() {

    }
}
</script>

<style scoped>

</style>