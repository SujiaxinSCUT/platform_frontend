<template>
    <div id="Admin">
        <basic-view :roles="this.roles"></basic-view>
    </div>
</template>

<script>
import {userDetailsStorage} from "@/utils/request";
import BasicView from "@/components/BasicView";

export default {
    name: "Admin",
    components: {BasicView},
    data() {
        return {
            roles: userDetailsStorage.get()['permission']
        }
    }
}
</script>

<style scoped>

</style>