<template>
    <div id="SubmitPurchaseOrder">
        <submit-order :is-sales-order="false"></submit-order>
    </div>
</template>

<script>
import SubmitOrder from "@/components/business/SubmitOrder";
export default {
    name: "SubmitPurchaseOrder",
    components: {SubmitOrder}
}
</script>

<style scoped>

</style>