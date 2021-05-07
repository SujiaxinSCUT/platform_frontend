<template>
    <el-container id="UploadView">
        <el-main>
            <el-form :model="form" label-width="120px" style="width: 60%;">
                <el-form-item prop="keyFile" label="密钥文件(*.key)">
                    <el-button type="primary" value="选择文件" id="keyFileImport"
                               v-on:click="clickKeyLoad" size="small">
                        选择文件
                    </el-button>
                    <input type="file" id="keyFiles" ref="refKeyFile"  accept=".key"
                           style="display: none" v-on:change="keyFileLoad">
                    <el-input v-model="form.keyFile" type="textarea" style="margin-top: 10px;" placeholder="输入密钥文件内容"
                              :autosize="{minRows: 6, maxRows: 10}"></el-input>
                </el-form-item>
                <el-form-item prop="keyFile" label="证书文件(*.crt)">
                    <el-button type="primary" value="选择文件" id="crtFileImport"
                               v-on:click="clickCrtLoad" size="small">
                        选择文件
                    </el-button>
                    <input type="file" id="crtFiles" ref="refCrtFile" accept=".crt" style="display: none" v-on:change="crtFileLoad">
                    <el-input v-model="form.crtFile" type="textarea" style="margin-top: 10px;" placeholder="输入密钥文件内容"
                              :autosize="{minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>

                <el-form-item prop="pemFile" label="私钥文件(*.pem)">
                    <el-button type="primary" value="选择文件" id="pemFileImport"
                               v-on:click="clickPemLoad" size="small">
                        选择文件
                    </el-button>
                    <input type="file" id="pemFiles" ref="refPemFile" accept=".pem" style="display: none" v-on:change="pemFileLoad">
                    <el-input v-model="form.pemFile" type="textarea" style="margin-top: 10px;" placeholder="输入私钥文件内容"
                              :autosize="{minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
            </el-form>
        </el-main>

        <el-footer>
            <el-button type="primary" @click="save">保存</el-button>
        </el-footer>
    </el-container>

</template>

<script>
import {userDetailsStorage} from "@/utils/request";
import {message} from "ant-design-vue";

export default {
    name: "UploadView",
    props: [],
    data() {
        return {
            form: {
                keyFile: '',
                crtFile: '',
                pemFile: ''
            },
            username: userDetailsStorage.get()['name']
        }
    },
    methods: {
        save() {
            localStorage.setItem("keyFileOf" + this.username, this.form.keyFile)
            localStorage.setItem("crtFileOf" + this.username, this.form.crtFile)
            localStorage.setItem("pemFileOf" + this.username, this.form.pemFile)
            message.success("保存成功")
        },
        clickKeyLoad() {
            document.getElementById('keyFiles').click()
        },
        clickCrtLoad() {
            document.getElementById('crtFiles').click()
        },
        clickPemLoad() {
            document.getElementById('pemFiles').click()
        },
        keyFileLoad() {
            const selectedFile = this.$refs.refKeyFile.files[0];
            let reader = new FileReader()
            reader.readAsText(selectedFile)
            reader.onload = (e) => {
                this.form.keyFile = e.target.result
            }
        },
        crtFileLoad() {
            const selectedFile = this.$refs.refCrtFile.files[0];
            let reader = new FileReader()
            reader.readAsText(selectedFile)
            reader.onload = (e) => {
                this.form.crtFile = e.target.result
            }
        },
        pemFileLoad() {
            const selectedFile = this.$refs.refPemFile.files[0];
            let reader = new FileReader()
            reader.readAsText(selectedFile)
            reader.onload = (e) => {
                this.form.pemFile = e.target.result
            }
        },
        close() {
            this.$emit("close")
            this.$nextTick(() => {
                this.form.keyFile = localStorage.getItem("keyFileOf" + this.username)
                this.form.crtFile = localStorage.getItem("crtFileOf" + this.username)
                this.form.pemFile = localStorage.getItem("pemFileOf" + this.username)
            })
        }
    },
    mounted() {
        let itemKey = "keyFileOf" + this.username
        this.form.keyFile = localStorage.getItem(itemKey)
        this.form.crtFile = localStorage.getItem("crtFileOf" + this.username)
        this.form.pemFile = localStorage.getItem("pemFileOf" + this.username)
    }
}
</script>

<style scoped>

</style>