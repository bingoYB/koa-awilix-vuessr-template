<template>
  <el-container id="container">
    <el-header class="app-header">
      <div class="app-top">
        APP NAME
      </div>
    </el-header>
    <el-container>
      <el-aside class="app-aside" width="200px">
        <div class="menu-item">
          <router-link :to="'/helloWorld'">helloWorld1</router-link>
        </div>
        <div class="menu-item">
          <router-link :to="'/index'">index</router-link>
        </div>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="postcss" scoped>
.app-header{
  background-color: #fff;
  padding: 0;
}
.app-aside{
  background-color:rgb(45 52 70);
  height:100vh;
}

.app-top{
  height:60px;
  width:200px;
  background-color:#1f2431;
  color:#fff;
  font-size:24px;
  text-align: center;
  line-height:60px;
}

::v-deep .menu-item a{
  width:100%;
  height:45px;
  color:#fff;
  line-height:45px;
  padding-left: 45px;
  text-decoration:none;
}
</style>
