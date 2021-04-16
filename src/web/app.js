import Vue from 'vue'
import App from './App.vue'
import {createRouter} from './router'
import {createStore} from './store'
import "./assets/index.css";
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Element)

export const createApp = async () => {
    const router = await createRouter()
    const store = createStore()
    const app = new Vue({
	    router,
	    store,
	    render: h => h(App)
	})
  return { app, router, store }
}