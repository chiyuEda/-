<template>
  <div class="site">
    <div class="seachbox">
      <el-select
        v-model="value9"
        filterable
        remote
        clearable
        reserve-keyword
        placeholder="请输入站点"
        :remote-method="remoteMethod"
        :loading="loading">
        <el-option
          v-for="item in options4"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="seachbtn"  @click="getList">搜索</div>
    </div>
    <div class="siteTable">
      <div class="site-bb site-bb1"></div>
      <div class="site-bb site-bb2"></div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-row-class-name="rowClass"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="name"
          label="服务点名称"
          width="300">
        </el-table-column>
        <el-table-column
          prop="linkman"
          label="负责人"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </div>
    <page
    :currentPage="currentPage"
    @handleCurrentChange="handleChange"
    :pagesize="pagesize"
    :totalCount="totalCount"></page>
  </div>
</template>

<script>
import Page from "./common/Page";
export default {
  name: "Site",
  components: {
    Page
  },
  data() {
    return {
      sitedata: "",
      tableData: [],
      options4: [],
      value9: "",
      list: [],
      loading: false,
      currentPage: 1,
      pagesize: 16,
      totalCount: 0
    };
  },
  methods: {
    handleChange(val) {
      this.currentPage = val;
      this.getList();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
      return "";
    },
    rowClass({ row, rowIndex }) {
      console.log(rowIndex); //表头行标号为0
      return "table-head-th";
    },
    remoteMethod(query) {
      this.getsearch();
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.list.filter(item => {
            return item.label.indexOf(query) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    },
    getList() {
      let para = {
        q_name: this.value9,
        pagesize: this.pagesize,
        pnum: this.currentPage
      };
      this.$ajaxPost("getSiteList", para).then(res => {
        console.log(res);
        this.tableData = res.data.result;
        this.totalCount = res.data.pager["totalCount"];
      });
    },
    getsearch() {
      let para = {
        type: 1
      };
      this.$ajaxPost("getServiceSel", para).then(res => {
        this.list = res.data.result.map(item => {
          return { value: item.name, label: item.name };
        });
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.site {
  padding: 6.625rem 4.375rem 0 4.375rem;
  box-sizing: border-box;
  background: #00289b;
  .seachbox {
    height: 3.125rem;
    line-height: 3.125rem;
    display: flex;
    margin-bottom: 2.1875rem;
    .seachbtn {
      padding: 0 2rem;
      height: 3.125rem;
      line-height: 3.125rem;
      background: #022ad6;
      text-align: center;
      cursor: pointer;
      border: 1px solid #00ffff;
      box-sizing: border-box;
      position: relative;
      top: 1px;
      border-left: 0;
    }
  }
  /deep/.el-select .el-input__inner {
    height: 3.125rem;
    border: 1px solid #00ffff;
    border-right: 0;
    display: inline-block;
    background: #00144d;
    box-sizing: border-box;
    border-radius: 0;
    font-size: 0.875rem;
    padding: 0 0.9375rem;
    width: 19rem;
    height: 3.125rem !important;
    outline: none;
    color: #fff;
    box-sizing: border-box;
  }
  /deep/.el-select__input {
    width: 19rem;
    height: 3.125rem !important;
    outline: none;
    color: #fff;
    box-sizing: border-box;
  }
  /deep/.el-table td,
  .el-table th {
    padding: 0;
  }
  /deep/.el-table .warning-row {
    background-color: #00144e;
  }

  /deep/.el-table .success-row {
    background-color: #000e34;
  }
  /deep/.el-table {
    padding-bottom: 6.25rem;
    background: #00289b;
  }
  /deep/.el-table td,
  .el-table th.is-leaf {
    border: 0;
    height: 2.5rem;
    color: #fff;
    font-size: 0.75rem;
  }
  /deep/.el-table th {
    background: none;
    border: 0;
    color: #fff;
    font-size: 1.25rem;
    padding-top: 0.625rem;
    box-sizing: border-box;
  }
  /deep/.el-table th > .cell {
    padding-top: 1.5rem;
    box-sizing: border-box;
  }
  /deep/.el-table th:nth-child(1) {
    padding-left: 3.75rem;
  }
  /deep/.el-table td:nth-child(1) {
    padding-left: 3.75rem;
  }
  /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #212e3e !important;
  }
  /deep/.el-table td {
    padding: 0.625rem 0;
  }
  /deep/.el-table .table-head-th {
    border: 0;
    background: url("../assets/table_top.png") no-repeat top;
    background-color: #00289b;
    padding-top: 0.625rem;
    background-size: 100% 100%;
    line-height: 3rem;
  }
  /deep/.el-table::before {
    height: 0;
  }
  .siteTable {
    position: relative;
    overflow: hidden;
    background: #022ad6;
    .site-bb {
      width: 0.625rem;
      height: 100%;
      position: absolute;
      background: #00289b;
      z-index: 99;
      top: 4.75rem;
    }
    .site-bb1 {
      left: 0;
    }
    .site-bb2 {
      right: 0;
    }
  }
}
</style>
