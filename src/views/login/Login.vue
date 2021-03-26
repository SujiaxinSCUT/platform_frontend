<template>
    <div id="login" style="width: 100%; height: 100%;">
        <el-card class="box-card">
            <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="50px" :hide-required-asterisk=true>
                <el-image :src="logoImg" style="left: 20%;margin-bottom: 20px"></el-image>
                <el-form-item label="账号" style="margin-right: 20px;"
                              prop="username">
                    <el-input auto-complete="off" v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" style="margin-right: 20px;"
                              prop="password" >
                    <el-input type="password" auto-complete="off" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <div style="align-content: center; margin-bottom: 20px;">
                    <el-radio-group v-model="radio">
                        <el-radio label="0" >商户</el-radio>
                        <el-radio label="1" >管理员</el-radio>
                    </el-radio-group>
                </div>
                <el-button type="primary" @click="submit" :loading=loading>登录</el-button>

            </el-form>
        </el-card>
    </div>

</template>

<script>
import Logo from '../../assets/login_logo.png'
import {login} from "@/service/common"
import {message} from "ant-design-vue"
import {HTTP} from "@/utils/http";
import {router} from "@/router/router";

export default {
    name: 'login',
    data() {
        return {
            radio: "0",
            logoImg: Logo,
            ruleForm: {
                username: '',
                password: '',
            },
            rules: {
                username: [{
                    required: true,
                    message: '账号不能为空',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur'
                }],
            },
            loading: false
        }
    },
    methods: {
        submit() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    //如果通过验证 to do...
                    this.login(this.ruleForm.username, this.ruleForm.password, this.radio === "0")
                } else {
                    return false
                }
            })
        },
        async login(username, password, isUser) {
            this.loading = true
            setTimeout(()=>{}, 3000)
            await login(username, password, isUser).then(res => {
                if (res.status === HTTP.OK) {
                    //TODO

                    if (isUser) {
                        router.push({path: '/business'})
                    } else {
                        router.push({path: '/admin'})
                    }
                }
            }).catch(err => {
                const res = err.response
                if (res.status === HTTP.BAD_CLIENT) {
                    message.error("用户名或密码错误")
                } else if (res.status === HTTP.BAD_SEVER) {
                    message.error("服务器出错，请稍后再试")
                }
            })
            this.loading = false
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-card {
    align-content: center;
    width:360px;
    margin:auto;
}
</style>
