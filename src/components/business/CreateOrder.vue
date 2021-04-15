<template>
    <div id="CreateOrder">
        <el-container>
            <el-header style="text-align: left; height: 30px; margin: 0">
                <el-button type="primary" style="margin-right: 20px"
                           @click="addProductDialogVisible = true" :disabled="loading">
                    添加产品
                </el-button>
            </el-header>
            <el-divider></el-divider>
            <el-main>
                <el-table
                    :data="tableData"
                    style="width: 610px;" height="250" :disabled="loading">
                    <el-table-column
                        prop="name"
                        label="产品名称"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="单价"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="quantity"
                        label="数量"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="totalPrice"
                        label="总价"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleDelete(scope.$index, tableData)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-divider></el-divider>
                <el-form :inline="true" :model="form" label-width="100px" :rules="rules" ref="form" :disabled="loading">
                    <el-form-item prop="clientName" label="客户名称">
                        <el-input v-model="form.clientName"></el-input>
                    </el-form-item>
                    <el-form-item prop="transactionDatetime" label="交易时间" >
                        <el-date-picker
                            v-model="form.transactionDatetime"
                            type="datetime"
                            placeholder="选择交易时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <el-form :model="form" label-width="100px" :rules="rules" ref="form">
                    <el-form-item prop="totalPrice" label="总价">
                        {{form.totalPrice}}
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
import {createOrder} from "@/service/business";
import {message} from "ant-design-vue"
import {RESULT} from "@/utils/http";

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
            tableData: [],
            form: {
                clientName: '',
                transactionDatetime: '',
                totalPrice: 0
            },
            rules: {
                clientName: [{required: true, trigger: 'blur', message: '请输入供货商名称'}],
                transactionDatetime: [{required: true, trigger: 'blur', message: '请选择交易时间'}],
                totalPrice: [{validator: checkNumber, trigger: 'blur'}],
            },
            loading: false
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
        addProduct(data) {
            let item = {
                product: data['product'],
                name: data['product'].name,
                price: data['price'],
                quantity: data['quantity'],
                totalPrice: data['price'] * data['quantity'],
            }
            this.tableData.push(item)
            this.form.totalPrice += item.totalPrice
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
            let res = await createOrder(this.form.clientName, this.form.transactionDatetime, data)
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
        }
    },
    computed: {
    }
}
</script>

<style scoped>

</style>