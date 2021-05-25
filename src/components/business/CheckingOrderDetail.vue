<template>
    <div id="CheckingOrderDetail">
        <ul>
            <el-card style="width: 70%">
                <el-divider content-position="left">订单产品信息</el-divider>
                <el-form label-width="100px" inline>
                    <el-row :gutter="30">
                        <el-col :span="9">
                            <el-form-item label="产品名称:">
                                {{orderedProduct.name}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="单位:">
                                {{orderedProduct.unit}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-form label-width="100px" inline>
                    <el-row :gutter="30">
                        <el-col :span="9">
                            <el-form-item label="单价:">
                                {{orderedProduct.price}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="数量:">
                                {{orderedProduct.quantity}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-divider content-position="left">选择产品批次</el-divider>
                <el-form label-width="100px" inline style="width: 100%">
                        <el-form-item :label="'批次' + index" v-for="(batch, index) in batches"
                                      :key="batch.batchId" style="width: 100%">
                                <el-select v-model="batch.batchId" placeholder="请选择" @change="change(index, batch.batchId)">
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
                                <el-input-number @change="updateBatch" v-model="batch.transactionNumber" placeholder="数量" style="width: 150px; margin-left: 10px;margin-right: 10px;"
                                                 :precision="2" :min="0" :step="0.01" :disabled="loading" :max="batch.restQuantity > orderedProduct.quantity ? orderedProduct.quantity : batch.restQuantity">
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
import {getProductsInStock} from "@/service/business";

export default {
    name: "CheckingOrderDetail",
    props: ['index', 'orderedProduct'],
    data() {
        return {
            batchList: null,
            batches: [{}],
            loading: false,
            selectedBatches: {}
        }
    },
    methods: {
        updateBatch() {
            let batches = {}
            for (let i in this.batches) {
                if (this.batches[i]['batchId']) {
                    batches[this.batches[i]['batchId']] = this.batches[i]['transactionNumber'] ? this.batches[i]['transactionNumber'] : 0
                }
            }
            this.selectedBatches.batches = batches
            this.$emit('update-batch', this.selectedBatches)
        },
        async getBatches(productId) {
            let res = await getProductsInStock(productId)
            if (res.code === RESULT.SUCCESS) {
                let batchList = res.data
                this.batchList = []
                for (let i in batchList) {
                    this.batchList.push({
                        transactionNumber: 0,
                        batchId: batchList[i]['batchId'],
                        quantity: batchList[i]['quantity'],
                        restQuantity: batchList[i]['restQuantity'],
                        date: batchList[i]['date']
                    })
                }
            } else {
                message.error(res.message)
            }
        },
        removeBatch(index) {
            if (index > 0) {
                this.batches.splice(index, 1)
                this.updateBatch()
            }
        },
        addBatch() {
            this.batches.push({})
        },
        clear() {
            this.batches = [{}]
        },
        change(index, batchId) {
            for (let i in this.batches) {
                if (this.batches[i] === batchId) {
                    message.info("已选择该批次")
                    return
                }
            }
            for (let i in this.batchList) {
                let batch = this.batchList[i]
                if (batch['batchId'] === batchId) {
                    this.batches[index] = {
                        transactionNumber: 0,
                        batchId: batch['batchId'],
                        quantity: batch['quantity'],
                        restQuantity: batch['restQuantity'],
                        date: batch['date']
                    }
                    break
                }
            }
            this.updateBatch()
        }
    },
    mounted() {
        this.getBatches(this.orderedProduct['id'])
        this.selectedBatches = {
            index: this.index,
            product: {
                id: this.orderedProduct['id'],
                name: this.orderedProduct['name'],
                unit: this.orderedProduct['unit']
            },
            price: this.orderedProduct.price,
            batches: {}
        }
        this.updateBatch()
    }
}
</script>

<style scoped>

</style>