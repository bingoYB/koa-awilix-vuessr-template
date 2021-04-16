<template>
    <div>
      <p>hello ,this is home page</p> 
      <div  class="test">{{testDta}}</div>
      <router-link :to="'/helloWorld'">helloWorld</router-link>

      <span>{{counters}}</span>
      <button @click="add">加</button>
    </div>
</template>
<script>
export default {
    data(){
      return {
        testDta:123,
        counters:0
      }
    },
    methods:{
      add:function(){
        this.counters++
      }
    }
}
</script>
<style scoped>
.test{
  color:red;
}
</style>