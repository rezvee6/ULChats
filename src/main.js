import Vue from 'vue'
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'

Vue.config.productionTip = false;
Vue.use(ElementUI, { locale });

export var app = new Vue({
    router,
    template: '<App/>',
    components: { App,},
}).$mount('#app')
