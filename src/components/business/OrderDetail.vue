<template>
    <el-card id="OrderDetail">
        <el-form :inline="true" :label-width="100">
            <el-form-item label="产品名称:">
                {{product.name}}
            </el-form-item>
            <el-form-item label="单位:">
                {{product.unit}}
            </el-form-item>
        </el-form>
        <el-form :inline="true" :label-width="100">
            <el-form-item label="单价:">
                {{product.price}}
            </el-form-item>
            <el-form-item label="数量:">
                {{product.quantity}}
            </el-form-item>
        </el-form>
        <el-form :label-width="100">
            <el-form-item label="选择批次">
                <el-autocomplete placeholder="选择产品" v-model="selectedBatch"
                                 :fetch-suggestions="querySearchAsync" @select="handleSelect"
                                 @change="clear" clearable></el-autocomplete>
            </el-form-item>
            <el-form-item>
                <el-table
                    :data="tableData"
                    style="width: 610px;" height="250">
                    <el-table-column
                        prop="batchId"
                        label="批次号"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="进货时间"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="transactionNumber"
                        label="交易数量"
                        width="120">
                        <template slot-scope="scope">
                            <el-input-number v-model="tableData[scope.$index]['transactionNumber']"
                                             :precision="2" :step="0.01"
                                             :min="0" :max="tableData[scope.$index]['quantity']"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="quantity"
                        label="余量"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleDelete(scope.$index, tableData)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import {message} from "ant-design-vue"
export default {
    name: "OrderDetail",
    props: ['index', 'product'],
    data() {
        return {
            batchList: [],
            tableData: [],
            selectedBatch: '',
        }
    },
    methods: {
        async querySearchAsync(queryString, cb) {
            if (!this.batchList) {
                await this.getStock()
            }
            let batchList = this.batchList ? this.batchList : []
            let results = queryString ? batchList.filter(this.createStateFilter(queryString)) : batchList
            for (let i in results) {
                let result = results[i]
                result['value'] = `${result['batch_id']}(${result['date']})`
            }
            cb(results)
        },
        createStateFilter(queryString) {
            return (product) => {
                return (product.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        async getStock() {

        },
        handleSelect(item) {
            if (this.batchExist(item['batch_id'])) {
                message.error("该批次已存在")
                return
            }
            let batch = {
                batchId: item['batch_id'],
                date: item['date'],
                transactionNumber: 0,
                quantity: item['quantity']
            }
            this.batchList.push(batch)
            this.selectedBatch = ''
        },
        batchExist(batchId) {
            for (let i in this.tableData) {
                if (this.tableData[i]['batch_id'] === batchId) {
                    return true
                }
            }
            return false
        }
    }
}
</script>

<style scoped>

</style>