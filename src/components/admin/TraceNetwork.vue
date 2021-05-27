<template>
    <div id="TraceNetwork" style="height: 400px;">

    </div>
</template>

<script>
import {DataSet, Network} from "vis"
export default {
    name: "TraceNetwork",
    props: [],
    methods: {
        globalTrace (network) {
            // create an array with nodes
            let nodeArray = []
            for (let i in network['nodes']) {
                let node = network['nodes'][i]
                let label = ''
                if (node['order']) {
                    let orderLabel = "订单\n\n"
                    let supplierLabel = `供货商：\t${node['supplierName']}\n`
                    let clientLabel = `客户：\t${node['clientName']}\n`
                    let quantityLabel = `数量：\t${node['quantity']}\n`
                    let proNameLabel = `商品名称：\t${node['productName']}\n`
                    let batchIdLabel = `批次号：\t${node['batchId'].substring(0, 8)}\n${node['batchId'].substring(8, 24)}\n`
                    label = orderLabel + supplierLabel + clientLabel + quantityLabel + proNameLabel + batchIdLabel
                } else {
                    let stockLabel = "库存\n\n"
                    let userLabel = `持有商户：\t${node['owner']}\n`
                    let dateLabel = `进货日期：\t${node['date'].substring(0, 10)}\n`
                    let proNameLabel = `商品名称：\t${node['productName']}\n`
                    let batchIdLabel = `批次号：\t${node['batchId'].substring(0, 8)}\n${node['batchId'].substring(8, 24)}\n`
                    label = stockLabel + userLabel + dateLabel + proNameLabel + batchIdLabel
                }
                nodeArray.push({
                    id: node['id'],
                    label: label,
                })
            }
            var nodes = new DataSet(nodeArray)
            // create an array with edges
            var edges = new DataSet(network['edges']);
            // create a network
            var container = document.querySelector('#TraceNetwork');
            // provide the data in the vis format
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {
                //节点样式
                nodes: {
                    shape: "box",//设置节点node样式为矩形
                    fixed:false,//节点node固定不可移动
                    font: {
                        color: "black", //字体的颜色
                        size: 16 //显示字体大小
                    },
                    scaling: {
                        min: 16,
                        max: 32 //缩放效果比例
                    },
                    labelHighlightBold: false
                },
                //连接线的样式
                edges: {
                    color: {
                        color: "rgb(97, 168, 224)",
                        highlight: "rgb(97, 168, 224)",
                        hover: "green",
                        inherit: "from",
                        opacity: 1.0
                    },
                    font: {
                        align: "top",//连接线文字位置
                    },
                    smooth: true, //是否显示方向箭头
                    arrows: {to : true },//箭头指向from节点
                },
                layout: {
                    //以分层方式定位节点
                    hierarchical: {
                        direction: "LR",//分层排序方向
                        sortMethod: "directed",//分层排序方法
                        levelSeparation:300//不同级别之间的距离
                    },
                },
                interaction: {
                    navigationButtons: true,
                    // hover: true, //鼠标移过后加粗该节点和连接线
                    selectConnectedEdges: false, //选择节点后是否显示连接线
                },

            };
            // initialize your network!
            this.network = new Network(container, data, options);
            // this.network.on("click",e=> this.showDetail(e));//单击事件
            // this.network.on("doubleClick",e=> this.enterService(e))//双击事件
        },
    },
    mounted() {
    }
}
</script>

<style scoped>

</style>