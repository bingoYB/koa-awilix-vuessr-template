<template>
  <div>
    <p>hello world</p>
    <div class="test">{{testDta}}</div>
  </div>
</template>
<script>
// 在这里导入模块，而不是在 `store/index.js` 中,因为只有这个页面使用
import storeModule from "./storeModule"
export default {
  async asyncData({ store, route }) {
    console.log(123)
    store.registerModule('helloModule', storeModule)
    return store.dispatch('helloModule/dataGet')
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed () {
    this.$store.unregisterModule('helloModule')
  },
  
  computed:{
    testDta(){
      return this.$store.state.helloModule.data
    }
  },
};
</script>
<style scoped>
.test {
  color: red;
}
</style>