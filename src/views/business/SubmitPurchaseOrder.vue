<template>
    <div id="SubmitPurchaseOrder">
        <create-order :is-sales-order="false"></create-order>
    </div>
</template>

<script>
import CreateOrder from "@/components/business/CreateOrder";
export default {
    name: "SubmitPurchaseOrder",
    components: {CreateOrder}
}
</script>

<style scoped>

</style>