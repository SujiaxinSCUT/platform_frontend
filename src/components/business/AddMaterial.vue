<template>
    <el-dialog id="AddMaterial" :visible.sync="dialogVisible" style="" title="添加原料" :before-close="close"
               width="500px" :center="true" :modal="false">
        <el-form :model="form" ref="form" :rules="rules"
                 label-position="left" :hide-required-asterisk="true" label-width="100px">
            <el-form-item prop="productName" label="请选择原料" required>
                <el-autocomplete placeholder="选择原料" v-model="form.productName"
                                 :fetch-suggestions="querySearchAsync" @select="handleSelect"
                                 @change="clear"  clearable></el-autocomplete>
            </el-form-item>
            <el-form-item prop="batchId" label="请选择批次" required>
                <el-select v-model="form.batchId" multiple collapse-tags placeholder="请选择" @change="change">
                    <el-option
                        v-for="item in batchList"
                        :key="item.batchId"
                        :label="item.batchId.substring(0, 4).concat('...')"
                        :value="item.batchId">
                        <span style="float: left">{{ item.batchId }}</span>
                        <span style="float: left; color: #8492a6; font-size: 12px">
                            （余量：{{ item.quantity }}，进货时间：{{ item.date.substring(0, 10) }}）
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="batchesAndNum" label="使用数量" required>
                    <div v-for="item in form.batchesAndNum" :key="item['batchId']" style="width: 90%;">
                        <el-tag @close="deleteOne(item)" style="float: left;margin-top: 3px;" closable size="medium">{{ item.batchId.substring(0, 4).concat('...') }} （余量：{{item.quantity}}）</el-tag>
                        <el-input-number v-model="item.usedNum" :precision="2" size="mini" controls-position="right"
                                         :min="0" :step="0.01"  :max="item.quantity" style="float: right;margin-top: 3px;"></el-input-number>
                    </div>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" @click="submitForm('form')">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {getAllProductsInStock, getProductsInStock} from "@/service/business";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";

export default {
    name: "AddMaterial",
    props:["dialogVisible"],
    data() {
        var batchNumValidator = (rule, value, callback) => {
            for (let i in value) {
                let item = value[i];
                if (item['usedNum'] <= 0) {
                    return callback(new Error("使用数量必须大于0"))
                }
            }
            callback()
        }
        return {
            form: {
                productName: "",
                batchId: [],
                batchesAndNum: []
            },
            rules: {
                productName: [{required: true, trigger: 'blur', message: '请选择产品'}],
                batchesAndNum: [{validator: batchNumValidator, trigger: 'blur'}],
            },
            currentProduct: null,
            productList: null,
            batchList: [],
            selectedBatches: []
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit("submit", this.form.batchesAndNum)
                    this.clear()
                    this.close()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        close() {
            this.$emit("close")
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
            let res = await getAllProductsInStock()
            if (res.code === RESULT.SUCCESS) {
                this.productList = res.data
            } else {
                message.error(res.message)
            }
        },
        async getBatches(productId) {
            let res = await getProductsInStock(productId)
            if (res.code === RESULT.SUCCESS) {
                let batchList = res.data
                for (let i in batchList) {
                    batchList[i]['usedNum'] = 0
                    this.batchList.push(batchList[i])
                }
            } else {
                message.error(res.message)
            }
        },
        createStateFilter(queryString) {
            return (product) => {
                return (product.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        clear() {
            this.$refs['form'].resetFields()
            this.batchList = []
            this.selectedBatches = []
            this.currentProduct = null
        },
        handleSelect(item) {
            this.currentProduct = item
            this.getBatches(item['id'])
        },
        change(list) {
            for (let i in list) {
                let item = list[i]
                for (let j in this.batchList) {
                    let batch = this.batchList[j]
                    if (batch['batchId'] === item && !this.selectedBatches.includes(batch['batchId'])) {
                        batch['usedNum'] = 0
                        batch['productName'] = this.currentProduct['name']
                        this.form.batchesAndNum.push(batch)
                        this.selectedBatches.push(batch['batchId'])
                    }
                }
            }
        },
        deleteOne(item) {
            this.form.batchesAndNum.splice(this.form.batchesAndNum.indexOf(item), 1)
            this.form.batchId.splice(this.form.batchId.indexOf(item['batchId']), 1)
            this.selectedBatches.splice(this.selectedBatches.indexOf(item['batchId']), 1)
        }
    }
}
</script>

<style scoped>

</style>