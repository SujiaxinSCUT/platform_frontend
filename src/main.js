import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import { router } from "@/router/router"
import ElementUI from 'element-ui'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'element-ui/lib/theme-chalk/index.css'


Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Antd)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
