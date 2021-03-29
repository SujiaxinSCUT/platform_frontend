<template>
    <el-dialog id="SubmitProduct" :visible.sync="dialogVisible" style="" title="提交新产品" :before-close="close"
        width="450px" :center="true">
        <el-form :model="form" label-position="left" :rules="rules" ref="form">
            <el-form-item label="产品名称" :label-width="formLabelWidth" prop="productName" required>
                <el-input v-model="form.productName" style="width: 200px" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="单位" :label-width="formLabelWidth" prop="unit" required>
                <el-input v-model="form.unit" style="width: 50px;" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="产品描述" :label-width="formLabelWidth" prop="description" required>
                <el-input v-model="form.description" type="textarea" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="上传图片" :label-width="formLabelWidth" prop="imageUrl" required style="width: 320px">
                <el-upload ref="uploadImg" :limit="3" :show-file-list="true"
                           :before-upload="beforeUpload" action="action"
                           accept="image/png,image/gif,image/jpg">
                    <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
                    <div slot="tip" class="el-upload__tip" style="margin-top: -10px">
                        只能上传3张以内jpg/png文件，且不超过1MB</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "SubmitProduct",
    props: ['dialogVisible'],
    data() {
        return {
            form: {
                productName: '',
                unit: '',
                description: '',
                imageUrl: ''
            },
            rules: {
                productName: [{required: true, trigger: 'blur', message: '请输入产品名称'}],
                unit: [{required: true, trigger: 'blur', message: '请输入单位'}],
                description: [{required: true, trigger: 'blur', message: '请输入产品描述'}],
                imageUrl: [{required: true, trigger: 'blur', message: '请提交产品图片'}],
            },

            formLabelWidth: '80px'
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        close() {
            this.$emit('close-dialog')
        },
        beforeUpload(file) {
            console.log(file)
            return true
        }
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