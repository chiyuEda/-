<template>
  <div id="app">
    <com-header v-if="dalg"></com-header>
    <router-view/>
  </div>
</template>

<script>
import comHeader from "./components/common/Header";
export default {
  name: "App",
  data() {
    return {
      msg: "app",
      dalg: true
    };
  },
  components: {
    comHeader
  },
  updated() {
    if (this.$route.path === "/login") {
      this.dalg = false;
    } else {
      this.dalg = true;
    }
  },
  created() {
    if (this.$route.path === "/login") {
      this.dalg = false;
    } else {
      this.dalg = true;
    }
  },
  mounted() {
    if (this.$route.path === "/login") {
      this.dalg = false;
    } else {
      this.dalg = true;
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  background: #00289b;
  position: absolute;
  font-size: 12px;
  color: #fff;
}
</style>
