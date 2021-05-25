<template>
    <el-container id="ProductTrace">
        <el-main>
            <el-form :inline="true" :model="form" :rules="rules" ref="form" :hide-required-asterisk="true">
                <el-form-item prop="batchId" label="批次号"  required>
                    <el-input v-model="form.batchId"></el-input>
                </el-form-item>

                <el-button-group>
                    <el-button type="primary" @click="submitForm('form', true)" :loading="loading">查询来源</el-button>
                    <el-button type="primary" @click="submitForm('form', false)" :loading="loading">查询去向</el-button>
                </el-button-group>

            </el-form>
            <el-divider></el-divider>
            <div>
                <trace-network ref="network"></trace-network>
            </div>

        </el-main>
        <el-footer>

        </el-footer>
    </el-container>
</template>

<script>
import TraceNetwork from "@/components/admin/TraceNetwork";
import {trace} from "@/service/admin";
import {RESULT} from "@/utils/http";
import {message} from "ant-design-vue";
export default {
    name: "ProductTrace",
    components: {TraceNetwork},
    data() {
        return {
            form: {
                batchId: ''
            },
            rules: {
                batchId: [{required: true, trigger: 'blur', message: '请填写批次号'}],
            },
            loading: false
        }
    },
    methods: {
        submitForm(formName, isBack) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.getTraceNetwork(isBack)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        async getTraceNetwork(isBack) {
            let res = await trace(this.form.batchId, isBack)
            if (res.code === RESULT.SUCCESS) {
                this.$refs.network.globalTrace(res.data)
            } else {
                message.error(res.message)
            }
        }
    }
}
</script>

<style scoped>

</style>