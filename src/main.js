import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import BaiduMap from 'vue-baidu-map'
Vue.prototype.postKeyValueRequest=postKeyValueRequest;
Vue.prototype.postRequest=postRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.deleteRequest=deleteRequest;

Vue.use(BaiduMap, {
  /* 需要注册百度地图开发者来获取你的ak */
  ak: 'z4sd6ya99vFDMlimXOAhiPDCRWb9OdSS'
})

import AMap from 'vue-amap';
Vue.use(AMap);

// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key: 'ea5a667228cc3f498fdf6ef8a11843fa',
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Geolocation']
});

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
