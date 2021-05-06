<template>
    <el-container id="SubmitProduct">
        <el-page-header @back="goBack" content="添加商品">
        </el-page-header>
        <el-main>
            <div style="margin-top: 20px;">
                <el-button type="text" @click="goBackToAddExistProduct" size="mini">返回添加已有商品</el-button>
                <el-form :model="form" label-position="left" :rules="rules" ref="form"  label-width="80px" inline style="width: 50%">
                    <el-form-item label="产品名称" prop="productName" required>
                        <el-input v-model="form.productName" style="width: 200px" :disabled="loading"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit" required  style="position: relative;left: 10%;">
                        <el-input v-model="form.unit" style="width: 50px;" :disabled="loading"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="form" label-position="left" :rules="rules" ref="form"  label-width="80px" inline style="width: 50%">
                    <el-form-item label="产品描述" prop="description" required>
                        <el-input v-model="form.description" type="textarea" style="width: 200px" :disabled="loading"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="form" label-position="left" :rules="rules" ref="form"  label-width="80px" inline style="width: 50%">
                    <el-form-item prop="price" label="单价" required>
                        <el-input-number v-model="form.price"
                                         :precision="2" :min="0" :step="0.01" :disabled="loading"
                                         :change="handlePriceChange">
                        </el-input-number>
                    </el-form-item>
                    <el-form-item prop="quantity" label="数量" required  style="position: relative;left: 13%;">
                        <el-input-number v-model="form.quantity" :precision="2"
                                         :min="0" :step="0.01" :disabled="loading"
                                         :change="handleQuantityChange"></el-input-number>
                    </el-form-item>
                </el-form>
                <el-form :model="form" label-position="left" :rules="rules" ref="form"  label-width="80px" style="width: 80%" inline>
                    <el-form-item label="上传图片"  prop="images" required style="width: 336px">
                        <el-upload ref="upload" :limit="3" :show-file-list="true"
                                   :auto-upload="false"
                                   :action="url"
                                   :data="form"
                                   :on-change="handleChange"
                                   accept="image/png,image/gif,image/jpg" multiple>
                            <el-button slot="trigger" size="small" type="primary" :disabled="loading">选取图片</el-button>
                            <div slot="tip" class="el-upload__tip" style="margin-top: -10px; margin-bottom: -10px">
                                只能上传3张以内jpg/png图片</div>

                        </el-upload>
                    </el-form-item>
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
            <el-button type="primary" @click="goBack" :loading="loading">返回</el-button>
            <el-button type="primary" @click="submitForm('form')" :loading="loading">提交</el-button>
        </el-footer>
        <add-material :dialog-visible="dialogVisible" @close="dialogVisible = false" @submit="getBatches"></add-material>
    </el-container>

</template>

<script>
import {saveStock, submitNewProduct} from "@/service/business"
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue"
import AddMaterial from "@/components/business/AddMaterial";
export default {
    name: "SubmitProduct",
    components: {AddMaterial},
    props: [],
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
            url: '/trace/product',
            form: {
                productName: '',
                unit: '',
                description: '',
                images: [],
                price: 0,
                quantity: 0
            },
            rules: {
                productName: [{required: true, trigger: 'blur', message: '请输入产品名称'}],
                unit: [{required: true, trigger: 'blur', message: '请输入单位'}],
                description: [{required: true, trigger: 'blur', message: '请输入产品描述'}],
                images: [{required: true, trigger: 'blur', message: '请提交产品图片'}],
                quantity: [{validator: checkNumber, trigger: 'blur'}],
                price: [{validator: checkNumber, trigger: 'blur'}],
            },
            formLabelWidth: '80px',
            loading: false,
            batchesAndNumList: [],
            dialogVisible: false
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let form = this.form
                    this.submitNewProduct(form.productName, form.description, form.images, form.unit, form.price, form.quantity)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleChange(file, fileList) {
            this.form.images = fileList
        },
        handleRemove(file, fileList) {
            this.form.images = fileList
        },
        async submitNewProduct(productName, description, images, unit, price, quantity) {
            this.loading = true
            let res = await submitNewProduct(productName, description, images, unit, price, quantity)
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
                        batchesNumMap: batchesForm
                    })
                }
                this.saveStock(res.data, batchList, productName, unit)
                this.$refs.upload.clearFiles()
                this.$refs['form'].resetFields()
                this.goBack()
            } else {
                message.error(res.message)
            }
            this.loading = false
        },
        saveStock(stock, batchList, productName, unit) {
            saveStock(stock, batchList, productName, unit)
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
        goBackToAddExistProduct() {
            this.$emit('go-back')
        },
        getBatches(batches) {
            if (this.matchBatches(batches)) {
                message.info("已存在该原料")
                return
            }
            this.batchesAndNumList.push(batches)
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
    },
    computed: {
    }
}
</script>

<style scoped>
</style>