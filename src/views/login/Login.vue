<template>
    <div id="login" style="width: 100%; height: 100%;background-color: azure;">
        <el-card class="box-card">
            <el-form ref="ruleForm" :rules="rules" :model="ruleForm"
                     label-position="left" label-width="50px"
                     :hide-required-asterisk=true>
<!--                <el-image :src="logoImg" style="margin-bottom: 10px;"></el-image>-->
                <span style="font-weight: bold;font-size: 20px;">商品追溯监管系统</span>
                <el-form-item label="账号" style="margin-right: 20px;margin-top: 20px;"
                              prop="username">
                    <el-input auto-complete="off" v-model="ruleForm.username" :disabled="loading"></el-input>
                </el-form-item>
                <el-form-item label="密码" style="margin-right: 20px;"
                              prop="password" >
                    <el-input type="password" auto-complete="off" v-model="ruleForm.password" :disabled="loading"></el-input>
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
import {message} from "ant-design-vue"
import {userDetailsStorage} from "@/utils/request";
import {login, getUserDetails} from "@/service/common";
import {RESULT} from "@/utils/http";

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
            loading: false,
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
            let res = await login(username, password, isUser)
            if (res.code === RESULT.SUCCESS) {
                let data = res.data
                let userType = ''
                if (isUser) {
                    userType = 'business'
                } else {
                    userType = 'admin'
                }
                data['user_type'] = userType
                userDetailsStorage.set(data, data['expires_in'])
                await this.getUserDetailsAndRedirect(username, userType)
            } else {
                message.error(res.message)
            }
            this.loading = false
        },
        async getUserDetailsAndRedirect(username, userType) {
            let res = await getUserDetails(username)
            if (res.code === RESULT.SUCCESS) {
                if (userDetailsStorage.updateValue(res.data)) {
                    console.log(res.data)
                    this.$router.push({path: `/${userType}`})
                } else {
                    message.error("保存用户信息出错，请重新登录")
                    this.$router.push({path: `/login`})
                }
            }

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#login{
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        padding-top: 60px;
        background-color: azure;
        height: 100%;
}
.box-card {
    align-content: center;
    width:360px;
    margin:auto;
}
</style>
