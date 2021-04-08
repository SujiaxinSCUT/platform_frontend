<template>
    <el-dialog id="SubmitProduct" :visible.sync="dialogVisible" style="" title="提交新产品" :before-close="close"
        width="450px" :center="true" :modal="false">
        <el-form :model="form" label-position="left" :rules="rules" ref="form" size="medium">
            <el-form-item label="产品名称" :label-width="formLabelWidth" prop="productName" required>
                <el-input v-model="form.productName" style="width: 200px" size="medium" :disabled="loading"></el-input>
            </el-form-item>
            <el-form-item label="单位" :label-width="formLabelWidth" prop="unit" required>
                <el-input v-model="form.unit" style="width: 50px;" size="medium" :disabled="loading"></el-input>
            </el-form-item>
            <el-form-item label="产品描述" :label-width="formLabelWidth" prop="description" required>
                <el-input v-model="form.description" type="textarea" style="width: 200px" :disabled="loading"></el-input>
            </el-form-item>
            <el-form-item label="上传图片" :label-width="formLabelWidth" prop="images" required style="width: 320px">
                <el-upload ref="upload" :limit="3" :show-file-list="true"
                           :auto-upload="false"
                           :action="url"
                           :data="form"
                           :on-change="handleChange"
                           accept="image/png,image/gif,image/jpg" multiple>
                    <el-button slot="trigger" size="small" type="primary" :disabled="loading">选取图片</el-button>
                    <div slot="tip" class="el-upload__tip" style="margin-top: -10px; margin-bottom: -10px">
                        只能上传3张以内jpg/png文件且不超过1MB</div>

                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" @click="submitForm('form')" :loading="loading">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {submitNewProduct} from "@/service/business"
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue"
export default {
    name: "SubmitProduct",
    props: ['dialogVisible'],
    data() {
        return {
            url: '/trace/product',
            form: {
                productName: '',
                unit: '',
                description: '',
                images: []
            },
            rules: {
                productName: [{required: true, trigger: 'blur', message: '请输入产品名称'}],
                unit: [{required: true, trigger: 'blur', message: '请输入单位'}],
                description: [{required: true, trigger: 'blur', message: '请输入产品描述'}],
                images: [{required: true, trigger: 'blur', message: '请提交产品图片'}],
            },
            formLabelWidth: '80px',
            loading: false
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let form = this.form
                    this.submitNewProduct(form.productName, form.description, form.images, form.unit)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        close() {
            this.$emit('close-dialog')
        },
        handleChange(file, fileList) {
            this.form.images = fileList
        },
        handleRemove(file, fileList) {
            this.form.images = fileList
        },
        async submitNewProduct(productName, description, images, unit) {
            this.loading = true
            let res = await submitNewProduct(productName, description, images, unit)
            if (res.code === RESULT.SUCCESS) {
                message.success(res.message)
                this.close()
                this.$refs.upload.clearFiles()
                this.$refs['form'].resetFields()
            } else {
                message.error(res.message)
            }
            this.loading = false
        }
    },
    computed: {
    }
}
</script>

<style scoped>
.el-form {
    width: 200px;
    margin-left: 10px;
    margin-top: -10px;
}
</style>