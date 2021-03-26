<template>
    <div id="CustomNav">
        <el-menu default-active="1" style="height: 500px;width: 200px;">
            <template v-for="(nav, index) in navList"
                      :index=index >
                <template v-if="!nav.accessRoles||this.permissionMatch(nav.accessRoles)">
                    <el-submenu v-if="nav.hasChildren" :key="index" :index=index.toString()>
                        <template slot="title">
                            <span>{{ nav.name }}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item v-for="(children, key) in nav.children"
                                          :key="key" :index="getChildIndex(index, key)">
                                <router-link :to="children.route.path" tag="div" slot="title">{{ children.name }}</router-link>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item v-else :key="index"  :index=index.toString()>
                        <template slot="title">
                            <router-link :to="nav.route.path" tag="div">{{ nav.name }}</router-link>
                        </template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: "CustomNav",
    props: ["roles", "navList"],
    methods: {
        permissionMatch(accessRoles) {
            for (let i in accessRoles) {
                let role = accessRoles[i]
                if (this.roles.includes(role)) {
                    return true
                }
            }
            return false
        },
        getChildIndex(parent, child) {
            return parent + "-" + child
        }
    },
    mounted() {

    }
}
</script>

<style scoped>

</style>