<template>
    <div id="Business">
        <basic-view :roles="this.roles"></basic-view>
    </div>
</template>

<script>
import BasicView from "@/components/BasicView";
export default {
    name: "Business",
    components: {BasicView},
    data() {
        return {
            roles: [
                "ROLE_USER"
            ]
        }
    }
}
</script>

<style scoped>

</style>