<template>
    <div id="AddStock">
        <el-container v-if="needAddNewProduct">
            <el-page-header @back="goBack" content="添加商品">
            </el-page-header>
            <el-main>
                <div style="margin-top: 20px;">
                    <el-button type="text" @click="changeType" size="mini">找不到商品信息？</el-button>
                    <el-form :model="form" ref="form" :rules="rules"
                             label-position="left" :hide-required-asterisk="true" label-width="90px">
                        <el-form-item prop="product" label="请选择产品" required>
                            <el-autocomplete placeholder="选择产品" v-model="form.product"
                                             :fetch-suggestions="querySearchAsync" @select="handleSelect"
                                             @change="clear" :disabled="loading" clearable></el-autocomplete>

                        </el-form-item>
                    </el-form>
                    <el-form :model="form" ref="form" :rules="rules" :inline="true"
                             label-position="left" :hide-required-asterisk="true" label-width="90px" style="width: 50%">
                        <el-form-item prop="name" label="产品名称">
                            <div style="width: 60px;">{{form.name}}</div>
                        </el-form-item>
                        <el-form-item prop="unit" label="单位" style="position: relative;left: 30%;">
                            <label>{{form.unit}}</label>
                        </el-form-item>
                    </el-form>
                    <el-form :model="form" ref="form" :rules="rules" :inline="true"
                             label-position="left" :hide-required-asterisk="true" label-width="90px" style="width: 50%">
                        <el-form-item prop="price" label="单价" required>
                            <el-input-number v-model="form.price"
                                             :precision="2" :min="0" :step="0.01" :disabled="loading"
                                             :change="handlePriceChange">
                            </el-input-number>
                        </el-form-item>
                        <el-form-item prop="quantity" label="数量" required style="position: relative;left: 10%;">
                            <el-input-number v-model="form.quantity" :precision="2"
                                             :min="0" :step="0.01" :disabled="loading"
                                             :change="handleQuantityChange"></el-input-number>
                        </el-form-item>
                    </el-form>
                    <el-form :model="form" ref="form" :rules="rules" :inline="true"
                             label-position="left" :hide-required-asterisk="true" label-width="90px">
                        <el-form-item prop="quantity" label="原料" required>
                            <el-button @click="dialogVisible = true" icon="el-icon-plus">选择原料</el-button>
                            <el-table :data="batchesAndNumList" height="180" >
                                <el-table-column label="原料名称" width="100">
                                    <span  slot-scope="scope">
                                        {{batchesAndNumList[scope.$index][0]['productName']}}
                                    </span>
                                </el-table-column>
                                <el-table-column label="使用数量" width="100">
                                    <span  slot-scope="scope">
                                        {{sum(batchesAndNumList[scope.$index])}}
                                    </span>
                                </el-table-column>
                                <el-table-column label="操作" width="100">
                                    <el-button effect="plain" slot-scope="scope"
                                               type="danger" icon="el-icon-delete" size="mini"
                                               @click="deleteOne(batchesAndNumList, scope.$index)"
                                               circle></el-button>
                                </el-table-column>
                            </el-table>

                        </el-form-item>
                    </el-form>
                </div>
            </el-main>
            <el-footer>
                <el-button type="primary" @click="submitForm('form')" :loading="loading">提交</el-button>
            </el-footer>
        </el-container>
        <submit-product v-else @go-back="changeType"></submit-product>
        <add-material :dialog-visible="dialogVisible" @close="dialogVisible = false" @submit="getBatches"></add-material>
    </div>

</template>

<script>
import SubmitProduct from "@/components/business/SubmitProduct";
import {addStock, saveStock} from "@/service/business";
import {getAllProducts} from "@/service/common";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
import AddMaterial from "@/components/business/AddMaterial";
export default {
    name: "AddStock",
    components: {AddMaterial, SubmitProduct},
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
            needAddNewProduct: true,
            dialogVisible: false,
            batchesAndNumList: []
        }
    },
    methods: {
        goBack() {
            this.$router.push('/business/my-product')
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let form = this.form
                    this.addStock(this.currentProduct['id'], form.quantity, form.price, form.unit)
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
        async addStock(productId, quantity, price, unit) {
            this.loading = true
            let res = await addStock(productId, quantity, price, unit)
            if (res.code === RESULT.SUCCESS) {
                message.success(res.message)
                let batchList = []
                for (let i in this.batchesAndNumList) {
                    let batchesAndNum = this.batchesAndNumList[i]
                    let batchesForm = {

                    }
                    for (let j in batchesAndNum) {
                        batchesForm[batchesAndNum[j]['batchId']] = batchesAndNum[j]['usedNum']
                    }
                    batchList.push({
                        productName: batchesAndNum[0]['productName'],
                        productId: batchesAndNum[0]['productId'],
                        batchesNumMap: batchesForm
                    })
                }
                this.saveStock(res.data, batchList, this.form.name, this.form.unit)
                this.clear()
            } else {
                message.error(res.message)
            }
            this.loading = false
        },
        saveStock(stock, batchList, productName, unit) {
            saveStock(stock, batchList, productName, unit)
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
        changeType() {
            this.needAddNewProduct = !this.needAddNewProduct
        },
        clear() {
            this.$refs['form'].resetFields()
            this.form = {
                product: '',
                name: '',
                unit: '',
                quantity: 0,
                price: 0,
            }
            this.currentProduct = null
        },
        getBatches(batches) {
            if (this.matchBatches(batches)) {
                message.info("已存在该原料")
                return
            }
            this.batchesAndNumList.push(batches)
            console.log(this.batchesAndNumList)
        },
        sum(arr) {
            let sum = 0
            for (let i in arr) {
                sum += arr[i]['usedNum']
            }
            return sum
        },
        deleteOne(rows, index) {
            rows.splice(index, 1)
        },
        matchBatches(batches) {
            for (let i in this.batchesAndNumList) {
                let batch = this.batchesAndNumList[i]
                if (batch[0]['productName'] === batches[0]['productName']) {
                    return true
                }
            }
            return false
        }
    }
}
</script>

<style scoped>

</style>