<template>
    <div id="CreateOrder">
        <el-container>
            <el-divider>创建订单</el-divider>
            <el-main>
                <el-form :model="form" label-width="120px" :rules="rules" ref="form" :disabled="loading" style="width: 80%">
                    <el-form-item prop="clientName" label="供应商名称" class="client-name">
                        <el-autocomplete placeholder="选择商户" v-model="form.clientName"
                                         :fetch-suggestions="querySearchAsync2" :disabled="loading" clearable></el-autocomplete>
                    </el-form-item>

                    <el-form-item
                        v-for="(product, index) in form.products"
                        :label="'产品' + index"
                        :key="product.key"
                        :prop="'products.' + index + '.value'"
                        :rules="{
                            required: true, message: '产品不能为空', trigger: 'blur'
                        }" class="product">
                        <el-autocomplete placeholder="选择产品" v-model="product.name"
                                         :fetch-suggestions="querySearchAsync" @select="handleSelect"
                                         @change="clear" :disabled="loading" clearable :disable="form.clientName === ''"
                        ></el-autocomplete>

                        <el-input-number v-model="product.price" placeholder="单价"
                                         :precision="2" :min="0" :step="0.01" :disabled="loading"
                                         :change="handlePriceChange">
                        </el-input-number>
                        <el-input-number v-model="product.txNum" placeholder="数量"
                                         :precision="2" :min="0" :step="0.01" :disabled="loading" :max="product.sum"
                                         :change="handleQuantityChange">
                        </el-input-number>
                        <el-button @click.prevent="removeProduct(index)">删除</el-button>
                    </el-form-item>
                    <el-form-item prop="totalPrice" label="总价">
                    {{form.totalPrice}}
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')">提交</el-button>
                        <el-button @click="addProduct">新增产品</el-button>
                        <el-button @click="clear">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-footer>
                <el-button type="primary" @click="submitForm('form')" :loading="loading">提交</el-button>
            </el-footer>
        </el-container>
        <add-product :dialog-visible="addProductDialogVisible"
                     :parent-type="parentType" @close-dialog="closeAddProductDialog"
                    @add-product-item="addProduct"/>
    </div>
</template>

<script>
import AddProduct from "@/components/business/AddProduct";
import {createOrder, getAllProductsInStock} from "@/service/business";
import {message} from "ant-design-vue"
import {RESULT} from "@/utils/http";
import {getAllUsername} from "@/service/common";
import {userDetailsStorage} from "@/utils/request";


const {PARENT_TYPE} = require('@/utils/business_const');

export default {
    name: "CreateOrder",
    components: {AddProduct},
    props: ['isSalesOrder'],
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
            parentType: this.isSalesOrder ? PARENT_TYPE.SUBMIT_SALES_ORDER : PARENT_TYPE.SUBMIT_PURCHASE_ORDER,
            addProductDialogVisible: false,
            form: {
                clientName: '',
                products: [{value: ''}],
                totalPrice: 0
            },
            rules: {
                clientName: [{required: true, trigger: 'blur', message: '请输入供货商名称'}],
                totalPrice: [{validator: checkNumber, trigger: 'blur'}],
            },
            productList: null,
            loading: false,
            usernames: null,
            selfName: userDetailsStorage.get().name
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitOrder()
                } else {
                    return false;
                }
            })
        },
        closeAddProductDialog() {
            this.addProductDialogVisible = false
        },

        handleDelete(index, rows) {
            let deleteOne = rows.splice(index, 1)
            this.form.totalPrice -= deleteOne[0].totalPrice
        },
        async submitOrder() {
            this.loading = true
            let data = []
            for (let i in this.tableData) {
                let item = this.tableData[i]
                data.push({
                    productId: item['product']['id'],
                    price: item['price'],
                    quantity: item['quantity']
                })
            }
            let res = await createOrder(this.form.clientName, data)
            if (res.code === RESULT.SUCCESS) {
                message.success("创建成功")
                this.clear()
            } else {
                message.error(res.message)
            }
            this.loading = false
        },
        clear() {
            this.$refs['form'].resetFields()
            this.tableData = []
        },
        removeProduct(index) {
            if (index !== -1) {
                this.form.products.splice(index, 1)
            }
        },
        addProduct() {
            this.form.products.push({
                value: '',
                key: Date.now(),
                txNum: 0,
                quantity: 0
            });
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
                result['txNum'] = 0
            }
            cb(results)
        },
        async getProductList() {
            let res = await getAllProductsInStock(this.form.clientName)
            console.log(res)
            if (res.code === RESULT.SUCCESS) {
                this.productList = res.data
            } else {
                message.error(res.message)
            }
        },
        createStateFilter(queryString) {
            return (product) => {
                return (product.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
            };
        },
        handleSelect(item) {
            console.log(item)
        },
        handlePriceChange(value) {
            console.log(value)
        },
        handleQuantityChange(value) {
            console.log(value)
        },
        async querySearchAsync2(queryString, cb) {
            if (!this.usernames) {
                await this.getUsernames()
            }

            let usernames = this.usernames ? this.usernames : []
            let results = queryString ? usernames.filter(this.createStateFilter2(queryString)) : usernames
            let newResults = []
            for (let i in results) {
                let result = results[i]
                if (result === this.selfName) continue
                newResults.push({value: result})
            }
            cb(newResults)
        },
        async getUsernames() {
            let res = await getAllUsername()
            if (res.code === RESULT.SUCCESS) {
                this.usernames = res.data
            } else {
                message.error(res.message)
            }
        },
        createStateFilter2(queryString) {
            return (username) => {
                return (username.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
            };
        },
    },
    computed: {
    }
}
</script>

<style scoped>
    .client-name .el-autocomplete{
        width: 30%;
    }
    .product .el-autocomplete{
        width: 30%;
        margin-right: 3px;
    }
    .product .el-input-number {
        width: 150px;
        margin-left: 3px;
        margin-right: 3px;
    }
</style>