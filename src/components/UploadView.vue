<template>
    <el-dialog id="UploadView" :visible="visible" title="保存私钥" width="500px" :before-close="close">
        <el-form :model="form" label-width="120px">
            <el-form-item prop="keyFile" label="密钥文件(*.key)">
                <el-button type="primary" value="选择文件" id="keyFileImport"
                           v-on:click="clickKeyLoad" size="small">
                    选择文件
                </el-button>
                <input type="file" id="keyFiles" ref="refKeyFile"  accept=".key"
                       style="display: none" v-on:change="keyFileLoad">
                <el-input v-model="form.keyFile" type="textarea" style="margin-top: 10px;" placeholder="输入密钥文件内容"
                          :autosize="{minRows: 4, maxRows: 6}"></el-input>
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
        </el-form>
        <div slot="footer" style="margin-top: -20px">
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "UploadView",
    props: ['visible', 'username'],
    data() {
        return {
            form: {
                keyFile: '',
                crtFile: ''
            },
        }
    },
    methods: {
        save() {
            localStorage.setItem("keyFileOf" + this.username, this.form.keyFile)
            localStorage.setItem("crtFileOf" + this.username, this.form.crtFile)
            this.close()
        },
        clickKeyLoad() {
            document.getElementById('keyFiles').click()
        },
        clickCrtLoad() {
            document.getElementById('crtFiles').click()
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
        close() {
            this.$emit("close")
            this.$nextTick(() => {
                this.form.keyFile =  localStorage.getItem("keyFileOf" + this.username)
                this.form.crtFile =  localStorage.getItem("crtFileOf" + this.username)
            })
        }
    },
    mounted() {
        console.log(this.username)
        let itemKey = "keyFileOf" + this.username
        console.log(itemKey)
        this.form.keyFile =  localStorage.getItem(itemKey)
        this.form.crtFile =  localStorage.getItem("crtFileOf" + this.username)
    }
}
</script>

<style scoped>

</style>