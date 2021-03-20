<template>
    <div id="CustomNav">
        <el-menu default-active="1">
            <el-submenu v-for="(nav, index) in navList"
                        v-if="nav.hasChildren" :key="index"
                        :index=index>

            </el-submenu>
            <el-menu-item v-for="(nav, index) in navList"
                          v-else :key="index"
                          :index=index>

            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: "CustomNav",
    props: ["type", "navList"],
    mounted() {

    }
}
</script>

<style scoped>

</style>