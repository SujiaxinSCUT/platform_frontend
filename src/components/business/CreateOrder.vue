<template>
    <div id="CreateOrder">
        <el-container>
            <el-divider content-position="left">创建订单</el-divider>
            <el-main>
                <el-form :model="form" label-width="120px" :rules="rules" ref="form" :disabled="loading" style="width: 80%">
                    <el-form-item prop="clientName" label="供应商名称" class="client-name">
                        <el-autocomplete placeholder="选择商户" v-model="form.clientName" @clear="clear"
                                         :fetch-suggestions="querySearchAsync2" :disabled="loading" clearable></el-autocomplete>
                    </el-form-item>

                    <el-form-item
                        v-for="(product, index) in form.products"
                        :label="'产品' + index"
                        :key="product.id"
                        :prop="'products.' + index"
                        :rules="{
                            validator: checker, trigger: 'blur'
                        }" class="product">
                        <el-autocomplete placeholder="选择产品" v-model="product.value"
                                         :fetch-suggestions="querySearchAsync" @select="handleSelect(index)"
                                         :disabled="loading" clearable></el-autocomplete>

                        <el-input-number v-model="product.price" placeholder="单价"
                                         :precision="2" :min="0" :step="0.01" :disabled="loading" @change="handlePriceChange">
                        </el-input-number>

                        <el-input-number v-model="product.txNum" placeholder="数量"
                                         :precision="2" :min="0" :step="0.01" :disabled="loading" :max="product.sum" @change="handleQuantityChange">
                        </el-input-number>
                        <el-button @click.prevent="removeProduct(index)">删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')">提交</el-button>
                        <el-button @click="addProduct">新增产品</el-button>
                        <el-button @click="clear">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-footer>

            </el-footer>
        </el-container>
    </div>
</template>

<script>
import {createOrder, getAllProductsInStock} from "@/service/business";
import {message} from "ant-design-vue"
import {RESULT} from "@/utils/http";
import {getAllUsername} from "@/service/common";
import {userDetailsStorage} from "@/utils/request";


const {PARENT_TYPE} = require('@/utils/business_const');

export default {
    name: "CreateOrder",
    components: {},
    props: ['isSalesOrder'],
    data() {
        var productChecker = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("此项不能为空"))
            }
            if (!value['value'] || value['value'] == '') {
                callback(new Error("请选择产品"))
            } else if (value['txNum'] <= 0){
                callback(new Error("交易数量必须大于0"))
            } else if (value['txNum'] > value['sum']) {
                callback(new Error("交易数量不能大于供应商库存"))
            } else if (value['price'] <= 0) {
                callback(new Error("价格必须大于0"))
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
            },
            rules: {
                clientName: [{required: true, trigger: 'blur', message: '请输入供货商名称'}],

            },
            productList: null,
            loading: false,
            usernames: null,
            selfName: userDetailsStorage.get().name,
            checker: productChecker
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
            for (let i in this.form.products) {
                let item = this.form.products[i]
                data.push({
                    productId: item['id'],
                    price: item['price'],
                    quantity: item['txNum']
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
            this.productList = null
            this.form.products = [{value: ''}]
        },
        removeProduct(index) {
            if (index > 0) {
                this.form.products.splice(index, 1)
            }
        },
        addProduct() {
            this.form.products.push({
                value: '',
                key: Date.now(),
            });
        },
        async querySearchAsync(queryString, cb) {
            if (!this.productList && this.form.clientName != '') {
                await this.getProductList()
            }
            let productList = this.productList ? this.productList : []
            let results = queryString ? productList.filter(this.createStateFilter(queryString)) : productList
            let filterResults = []
            for (let i in results) {
                let result = results[i]
                result['value'] = `${result.name}(余量：${result.sum}   描述：${result.description})`
                let contains = false
                for (let i in this.form.products) {
                    if (result['value'] === this.form.products[i]['value']) {
                        contains = true
                        break
                    }
                }
                if (!contains) {
                    filterResults.push(result)
                }
            }
            cb(filterResults)
        },
        async getProductList() {
            let res = await getAllProductsInStock(this.form.clientName)
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
        handleSelect(index) {
            let currPro = this.form.products[index]
            for (let i in this.productList) {
                let pro = this.productList[i]
                if (currPro['value'] === pro['value']) {
                    currPro['price'] = 0
                    currPro['txNum'] = 0
                    currPro['name'] = pro['name']
                    currPro['id'] = pro['id']
                    currPro['sum'] = pro['sum']
                }
            }
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