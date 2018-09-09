<template>
  <div class="header">
      <div class="headLeft">双网融合服务平台</div>
      <div class="headRight">
        <router-link to="/home">首页</router-link>
        <router-link to="/data">数据列表</router-link>
        <router-link to="/analysis">数据分析</router-link>
        <router-link to="/site">站点列表</router-link>
      </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      msg: "header"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header {
  width: 100%;
  height: 5rem;
  background: rgba(0, 24, 103, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5rem;
  box-sizing: border-box;
  z-index: 9999;
  position: fixed;
  top: 0;
  .headLeft {
    font-size: 1.75rem;
    font-weight: 600;
  }
  .headRight {
    a {
      display: inline-block;
      width: 8.75rem;
      height: 2.5rem;
      background: url("../../assets/home_bj2.png") no-repeat center;
      background-size: 100% 100%;
      text-align: center;
      line-height: 2.5rem;
      text-decoration: none;
      color: #fff;
      font-size: 1rem;
      margin-left: 0.625rem;
    }
    .router-link-active.router-link-exact-active {
      background: url("../../assets/home_bj.png") no-repeat center;
      background-size: 100% 100%;
    }
  }
}
</style>
