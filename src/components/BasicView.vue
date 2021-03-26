<template>
    <div id="BaseView" style="width: 100%; height: 100%;">
        <el-card class="box-card">
            <el-container>
                <el-aside style="width: 200px;height: 500px">
                    <custom-nav :nav-list=this.navList :roles=this.roles></custom-nav>
                </el-aside>
                <el-container>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </el-card>


    </div>
</template>

<script>
import CustomNav from "@/components/CustomNav";
import {navList} from "../utils/nav"
const MyProduct = require("@/views/business/MyProduct");

export default {
    name: "BasicView",
    components: {CustomNav},
    props: ['roles'],
    data() {
        return {
            navList: null,
            myProduct: MyProduct
        }
    },
    methods: {
        loadRoles() {
            if (this.roles.includes("ROLE_USER")) {
                this.navList = navList.businessNavList
            } else {
                this.navList = navList.adminNavList
            }
        }
    },
    beforeMount() {
        this.loadRoles()
    },
}
</script>

<style scoped>
.box-card {
    align-content: center;
    width:800px;
    height: 540px;
    margin:auto;
}
</style>