<template>
    <el-dialog id="SubmitProduct" :visible.sync="visible">

    </el-dialog>
</template>

<script>
export default {
    name: "SubmitProduct",
    props: ['visible'],
    data() {
        return {
            form: {
                name: '',

            }
        }
    }
}
</script>

<style scoped>

</style>