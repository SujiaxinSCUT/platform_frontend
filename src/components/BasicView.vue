<template>
    <div id="BaseView" style="width: 100%; height: 100%;">
<!--        <el-card class="box-card">-->
            <el-container>
                <el-aside style="width: 250px;height: 100%;">
                    <div class="logo">
                        <span>
                            Hello! {{this.userName}}
                        </span>
                    </div>
                        <business-nav v-if="roles.includes('ROLE_USER')"></business-nav>
                        <admin-nav v-else :roles="roles"></admin-nav>

                </el-aside>
                <el-container>
                    <el-header style="width: 100%;height: 50px; background-color: #409EFF;border: 2px solid #EBEEF5;">
                        <el-button type="primary" icon="el-icon-key" circle @click="uploadViewVisible = true"></el-button>
                    </el-header>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
<!--        </el-card>-->
            <upload-view :visible="uploadViewVisible" @close="closeUploadView" :username="userName"></upload-view>
    </div>
</template>

<script>
import BusinessNav from "@/components/BusinessNav";
const MyProduct = require("@/views/business/MyProduct");
import {userDetailsStorage} from "@/utils/request";
import AdminNav from "@/components/AdminNav";
import UploadView from "@/components/UploadView";
export default {
    name: "BasicView",
    components: {UploadView, AdminNav, BusinessNav},
    props: ['roles'],
    data() {
        return {
            myProduct: MyProduct,
            userName: userDetailsStorage.get()['name'],
            uploadViewVisible: false
        }
    },
    methods: {
        closeUploadView() {
            this.uploadViewVisible = false
        }
    },
    beforeMount() {
    },
}
</script>

<style scoped>
.logo {
    height: 50px;
    width: 250px;
    border: 2px solid #EBEEF5;
    text-align: center;
    font-size: 20px;
    background-color: #409EFF;
    -webkit-text-fill-color: #fff;
}
</style>