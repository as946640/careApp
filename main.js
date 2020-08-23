import Vue from 'vue'
import App from './App'
import api from '@/common/api/api.js'
import request from '@/common/api/request.js'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$request = request.request;
Vue.prototype.$api = api;

const app = new Vue({
    ...App
})
app.$mount()
