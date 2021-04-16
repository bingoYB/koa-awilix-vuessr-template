import request from "../utils/request"
const stateModule = {
  namespaced: true,
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    data: 0
  }),
  actions: {
    dataGet({ commit }, id) {
      // `store.dispatch()` 会返回 Promise，
      // 以便我们能够知道数据在何时更新
      return request('/data/get').then(res => {
        console.log(res)
        commit('SET_DATA', res.data)
      })
    }
  },
  mutations: {
    SET_DATA(state, data) {
      state.data = data
    }
  }
}

export default stateModule