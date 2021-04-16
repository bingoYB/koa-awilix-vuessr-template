import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'

Vue.use(Vuex)

export const createStore = () => {
  const store = new Vuex.Store({})
  store.registerModule('app', app)
  return store
}
