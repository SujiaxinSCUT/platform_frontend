<template>
    <div id="CheckingOrderDetail">
        <ul>
            <el-card style="width: 1000px;">
                <el-form label-width="100px">
                    <el-form-item label="产品名称:">
                        {{product.name}}
                    </el-form-item>
                    <el-form-item label="单位:">
                        {{product.unit}}
                    </el-form-item>
                    <el-form-item label="单价:">
                        {{product.price}}
                    </el-form-item>
                    <el-form-item label="数量:">
                        {{product.quantity}}
                    </el-form-item>
                    <el-form-item label="选择批次">
                        <el-autocomplete placeholder="选择产品" v-model="selectedBatch"
                                         :fetch-suggestions="querySearchAsync" @select="handleSelect"
                                          clearable></el-autocomplete>
                    </el-form-item>
                    <el-form-item>
                        <el-table
                            :data="tableData"
                            style="width: 700px;" height="250">
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
                                width="200">
                                <template slot-scope="scope">
                                    <el-input-number v-model="tableData[scope.$index]['transactionNumber']"
                                                     :precision="2" :step="0.01" @change="updateBatch"
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
                        </el-table>
                    </el-form-item>
                </el-form>
            </el-card>
        </ul>
    </div>

</template>

<script>
import {message} from "ant-design-vue"
import {RESULT} from "@/utils/http";
import {getAllProductsInStock} from "@/service/business";
import {userDetailsStorage} from "@/utils/request";

export default {
    name: "CheckingOrderDetail",
    props: ['index', 'product'],
    data() {
        return {
            batchList: null,
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
            let userDetails = userDetailsStorage.get()
            let res = await getAllProductsInStock(userDetails['name'])
            if (res.code === RESULT.SUCCESS) {
                this.batchList = res.data
            } else {
                message.error(res.message)
            }
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
            this.tableData.push(batch)
            this.selectedBatch = ''
        },
        batchExist(batchId) {
            for (let i in this.tableData) {
                if (this.tableData[i]['batchId'] === batchId) {
                    return true
                }
            }
            return false
        },
        updateBatch() {
            let data = {
                index: this.index,
                batch: this.tableData
            }
            this.$emit('update-batch', data)
        },
        handleDelete(index, rows) {
            rows.splice(index, 1)
            this.updateBatch()
        }
    }
}
</script>

<style scoped>

</style>