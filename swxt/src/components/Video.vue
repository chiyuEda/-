<template>
  <div class="video">
    <div class="videoBack">
      <router-link to="/home">
        <img src="../assets/icon_go.png">
        返回首页
      </router-link>
    </div>
    <div class="videoList">
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item,key) in videoList" :key="key">
          <div class="grid-content bg-purple" @click="openVideo(item)">
            <div>{{item.servicename}} {{item.name}}</div>
            <iframe :src="item.url" style="width:100%;" frameborder="0" scrolling="no"></iframe>
          </div>
        </el-col>
      </el-row>
    </div>
    <page
      :currentPage="currentPage"
      @handleCurrentChange="handleChange"
      :pagesize="pagesize"
      :totalCount="totalCount"></page>
    <el-dialog 
      :visible.sync="dialogTableVisible"
      :show-close="false">
      <!-- :close-on-click-modal="false" -->
      <div class="dialogHead">
        <div class="dialogHeadText">{{dialogList.servicename}} {{dialogList.name}}</div>
        <img src="../assets/suoxiao_min.png" alt="" class="closeDialog" @click="dialogTableVisible=false">
      </div>
      <!-- <video poster="../assets/video_img.jpg" :src="dialogList.url" class="dialogImg"></video> -->
      <!-- <video id="myPlayer" poster="" :src="dialogList.url" controls playsInline webkit-playsinline autoplay>
        <source :src="dialogList.url" type="" />
      </video> -->
      <iframe :src="dialogList.url+'&autoplay=1'" style="width:100%;height:500px" frameborder="0"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import Page from "./common/Page";
export default {
  name: "Video",
  components: {
    Page
  },
  data() {
    return {
      currentPage: 1,
      pagesize: 18,
      totalCount: 0,
      dialogTableVisible: false,
      videoList: [],
      dialogList: ""
    };
  },
  methods: {
    handleChange(val) {
      this.currentPage = val;
      this.getList();
    },
    openVideo(val) {
      console.log(val);
      this.dialogTableVisible = true;
      this.dialogList = val;
    },
    getList() {
      let para = {
        pnum: this.currentPage,
        pagesize: this.pagesize
      };
      this.$ajaxPost("workingList", para).then(res => {
        this.videoList = res.data.result;
        this.totalCount = res.data.pager.totalCount;
      });
    }
  },
  mounted() {
    this.getList();
    var i = 0;
    setInterval(() => {
      i++;
      if (i % 2 == 0) {
        this.getList();
      }
    }, 30000);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.video {
  padding: 6.25rem 8.125rem 0 8.125rem;
  box-sizing: border-box;
  background: #00289b;
  .videoBack {
    a {
      display: block;
      width: 10.625rem;
      height: 3.4375rem;
      line-height: 3.4375rem;
      background: #00144d;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00ffff;
      text-decoration: none;
      font-size: 1rem;
      margin-left: 0.75rem;
      margin-bottom: 1rem;
      img {
        height: 70%;
        margin-right: 1.25rem;
      }
    }
  }
  .grid-content {
    background: url("../assets/sever_bg.png") no-repeat center;
    background-size: 100% 100%;
    width: 19.375rem;
    height: 15rem;
    margin: 0.75rem;
    text-align: center;
    padding: 1rem 1.875rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    div {
      height: 2.5rem;
      line-height: 2.5rem;
      background: #011f92;
      margin-top: 2rem;
    }
  }
  /deep/.el-dialog {
    background: url("../assets/tkbg.png") no-repeat center;
    width: 63.75rem;
    height: 46.25rem;
    background-size: 100% 100%;
    padding: 0 2.5rem;
    color: #fff;
    .dialogHead {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      .dialogHeadText {
        background: url("../assets/title_bg.png") no-repeat center;
        // width: 15rem;
        height: 2.5rem;
        line-height: 2.5rem;
        // background-size: 100% 100%;
        padding-left: 1.25rem;
        box-sizing: border-box;
      }
    }
    .closeDialog {
      width: 3.125rem;
      height: 2.5rem;
      cursor: pointer;
    }
    .dialogImg {
      width: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
  /deep/.el-dialog__body {
    color: #fff;
  }
}
</style>
