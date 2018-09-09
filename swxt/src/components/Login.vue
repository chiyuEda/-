<template>
  <div class="login">
    <div class="loginbtn">
      <div class="loginhead">双网融合系统</div>
        <el-input
        placeholder="请输入账号"
        v-model="username"
        clearable>
        </el-input>
        <el-input
        type="password"
        placeholder="请输入密码"
        v-model="password"
        clearable>
        </el-input>
        <el-button type="primary" @click="login">立即登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      let para = {
        account: this.username,
        password: this.password
      };
      this.$ajaxGet("userLogin", para).then(res => {
        if (res.data.success) {
          sessionStorage.setItem("user", JSON.stringify(res.data.result));
          this.$router.push({ path: "/home" });
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    }
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login {
  .loginbtn {
    width: 30rem;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    .loginhead {
      text-align: center;
      font-size: 3.75rem;
      margin-bottom: 5rem;
      font-weight: 600;
    }
    div {
      margin: 0.625rem 0;
    }
    button {
      margin-top: 2rem;
      background: #022ad6;
      border: 0;
    }
  }
}
</style>
