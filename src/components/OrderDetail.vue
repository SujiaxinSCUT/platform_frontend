<template>
    <el-container id="OrderDetail">
        <el-main>
                <label class="title">订单信息</label>
                    <el-form :model="form" ref="form"  :inline="true" style="margin-top: 20px;"
                             label-position="left" :hide-required-asterisk="true" label-width="90px" >
                        <el-row :gutter="30">
                            <el-col :span="6">
                                <el-form-item prop="name" label="订单号：" class="item">
                                    <div style="width: 60px;">{{form.id}}</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="unit" label="交易时间：" >
                                    <label>{{form.date}}</label>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-form :model="form" ref="form" :inline="true"
                             label-position="left" :hide-required-asterisk="true" label-width="90px" >
                        <el-row :gutter="30">
                            <el-col :span="6">
                                <el-form-item prop="name" label="供货商：" class="item">
                                    <div style="width: 60px;">{{form.supplierName}}</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="unit" label="客户：" >
                                    <label>{{form.clientName}}</label>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="unit" label="订单状态：" >
                                    <el-tag :type="statusMapping[item.status].type" size="small">
                                        {{statusMapping[item.status].value}}
                                    </el-tag>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

            <label class="title">交易商品信息</label>
            <div v-for="item in this.productList" :key="item">
                <el-form :model="form" ref="form"  :inline="true" style="margin-top: 20px;"
                         label-position="left" :hide-required-asterisk="true" label-width="90px" >
                    <el-row :gutter="30">
                        <el-col :span="6">
                            <el-form-item prop="name" label="商品名称：" class="item">
                                <div style="width: 60px;">{{item.name}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="unit" label="单位：" >
                                <label>{{item.unit}}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-form :model="form" ref="form"  :inline="true"
                         label-position="left" :hide-required-asterisk="true" label-width="90px" >
                    <el-row :gutter="30">
                        <el-col :span="6">
                            <el-form-item prop="name" label="单价：" class="item">
                                <div style="width: 60px;">{{item.price}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="unit" label="交易数量：" >
                                <label>{{item.quantity}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="form.status === 'success' || form.status === 'checking'">
                            <el-form-item prop="unit" label="交易批次：" >

                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

        </el-main>
    </el-container>
</template>

<script>

import {ORDER_STATUS_MAPPING} from "@/utils/status";

export default {
    name: "OrderDetail",
    data() {
        return {
            form: {

            },
            productList: {

            },
            statusMapping: ORDER_STATUS_MAPPING,
        }
    }
}
</script>

<style scoped>
.title {
    font-weight: 900;
    font-size: 24px;
    line-height: 2;
    margin-bottom: 50px;
    color: rgba(0, 0, 0, 0.85);
}

/deep/ .el-form-item__label{
    color: rgba(0,0,0,.85);
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    padding-bottom: 16px;
    margin-right: 8px;
}

</style>

<style>
.item .el-form-item__label{
    color: rgba(0,0,0,.85);
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    padding-bottom: 16px;
    margin-right: 8px;
}
</style>