<template>
  <div class="allPage">
      <button @click="goFirst">首页</button>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        background
        :page-size="pagesize"
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        :total="totalCount">
        </el-pagination>
      <button @click="goLast">末页</button>
    </div>
</template>

<script>
export default {
  name: "Page",
  data() {
    return {
      pageNo: this.currentPage
    };
  },
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pagesize: {
      type: Number,
      default: 20
    },
    totalCount: {
      type: Number,
      default: 100
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    goFirst() {
      this.$emit("handleCurrentChange", 1);
    },
    goLast() {
      var total = 1;
      if (this.totalCount % this.pagesize == 0) {
        total = this.totalCount / this.pagesize;
      } else {
        total = parseInt(this.totalCount / this.pagesize) + 1;
      }
      this.$emit("handleCurrentChange", total);
    }
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.allPage {
  position: fixed;
  left: 0;
  bottom: 4rem;
  width: 100%;
  display: flex;
  height: 2.1875rem;
  justify-content: center;
  /deep/.el-pagination {
    margin: 0;
  }
  button {
    border: 0;
    width: 5.3125rem;
    height: 2.1875rem;
    background: #00144d;
    color: #fff;
    outline: none;
    cursor: pointer;
    position: relative;
    top: 2px;
  }
  /deep/.number {
    background: #00144d !important;
    color: #fff !important;
    width: 2.1875rem;
    height: 2.1875rem;
    font-weight: 100;
  }
  /deep/.btn-prev,
  /deep/.btn-next {
    width: 5.3125rem;
    height: 2.1875rem;
    background: #00144d;
    color: #fff;
  }
  /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #022ad6 !important;
    border: 1px solid #00ffff !important;
    color: #fff !important;
  }
  /deep/li {
    background-color: #00144d !important;
    color: #fff !important;
  }
}
</style>
