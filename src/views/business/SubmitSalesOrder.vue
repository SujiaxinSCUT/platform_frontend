<template>
    <div id="SubmitSalesOrder">
        <submit-order :is-sales-order="true"></submit-order>
    </div>
</template>

<script>
import SubmitOrder from "@/components/business/SubmitOrder";
export default {
    name: "SubmitSalesOrder",
    components: {SubmitOrder}
}
</script>

<style scoped>

</style>