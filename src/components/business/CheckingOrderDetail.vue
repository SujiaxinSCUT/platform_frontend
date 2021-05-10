<template>
    <div id="CheckingOrderDetail">
        <ul>
            <el-card style="width: 70%">
                <el-divider content-position="left">订单产品信息</el-divider>
                <el-form label-width="100px" inline>
                    <el-row :gutter="30">
                        <el-col :span="9">
                            <el-form-item label="产品名称:">
                                {{product.name}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="单位:">
                                {{product.unit}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-form label-width="100px" inline>
                    <el-row :gutter="30">
                        <el-col :span="9">
                            <el-form-item label="单价:">
                                {{product.price}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="数量:">
                                {{product.quantity}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-divider content-position="left">选择产品批次</el-divider>
                <el-form label-width="100px" inline style="width: 100%">
                        <el-form-item :label="'批次' + index" v-for="(batch, index) in batches"
                                      :key="batch.batchId" style="width: 100%">
                                <el-select v-model="batch.batchId" placeholder="请选择">
                                    <el-option
                                        v-for="item in batchList"
                                        :key="item.batchId"
                                        :label="item.batchId"
                                        :value="item.batchId">
                                        <span style="float: left">{{ item.batchId }}</span>
                                        <span style="float: left; color: #8492a6; font-size: 12px">
                                            （余量：{{ item.quantity }}，进货时间：{{ item.date.substring(0, 10) }}）
                                        </span>
                                    </el-option>
                                </el-select>
                                <el-input-number v-model="batch.transactionNumber" placeholder="数量" style="width: 150px; margin-left: 10px;margin-right: 10px;"
                                                 :precision="2" :min="0" :step="0.01" :disabled="loading" :max="batch.quantity">
                                </el-input-number>
                                <el-button @click.prevent="removeBatch(index)">删除</el-button>
                        </el-form-item>
                    <el-form-item label="     ">
                        <el-button @click="addBatch">添加批次</el-button>
                        <el-button @click="clear">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </ul>
    </div>

</template>

<script>
import {message} from "ant-design-vue"
import {RESULT} from "@/utils/http";
import {getAllProductsInStock, getProductsInStock} from "@/service/business";
import {userDetailsStorage} from "@/utils/request";

export default {
    name: "CheckingOrderDetail",
    props: ['index', 'product'],
    data() {
        return {
            batchList: null,
            batches: [{}],
            loading: false,
        }
    },
    methods: {
        async getStock() {
            let userDetails = userDetailsStorage.get()
            let res = await getAllProductsInStock(userDetails['name'])
            if (res.code === RESULT.SUCCESS) {
                this.batchList = res.data
            } else {
                message.error(res.message)
            }
        },
        updateBatch() {
            let data = {
                index: this.index,
                batch: this.tableData
            }
            this.$emit('update-batch', data)
        },
        async getBatches(productId) {
            let res = await getProductsInStock(productId)
            console.log(res)
            if (res.code === RESULT.SUCCESS) {
                let batchList = res.data
                this.batchList = []
                for (let i in batchList) {
                    this.batchList.push({
                        transactionNumber: 0,
                        batchId: batchList[i]['batchId'],
                        quantity: batchList[i]['quantity'],
                        date: batchList[i]['date']
                    })
                }
                console.log(this.batchList)
            } else {
                message.error(res.message)
            }
        },
        removeBatch(index) {
            if (index > 0) {
                this.batches.splice(index, 1)
            }
        },
        addBatch() {
            this.batches.push({})
        },
        clear() {
            this.batches = [{}]
        }
    },
    mounted() {
        this.getBatches(this.product['id'])
    }
}
</script>

<style scoped>

</style>