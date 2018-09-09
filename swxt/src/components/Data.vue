<template>
  <div class="data">
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
      <div class="block">
        <el-date-picker
          v-model="start"
          align="right"
          type="date"
          placeholder="选择开始日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions1">
        </el-date-picker>
      </div>
      <div class="block">
        <el-date-picker
          v-model="end"
          align="right"
          type="date"
          placeholder="选择结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions1">
        </el-date-picker>
      </div>
      <div class="seachbtn" @click="getType();handleChange(1);getOneList();">搜索</div>
      <!-- <div class="seachbtn">导出数据</div> -->
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
          prop="servicename"
          label="服务点名称"
          width="250">
        </el-table-column>
          <el-table-column
          v-for="(item,key) in typeList"
          :key="key"
          :prop="item.name"
          :label="item.id">
        </el-table-column>
        <el-table-column
          prop="recycdate"
          label="回收日期"
          v-if="tableflag">
        </el-table-column>
        <el-table-column
          prop="categoryname"
          label="分类"
          v-if="tableflag">
        </el-table-column>
        <el-table-column
          prop="number"
          label="数量"
          v-if="tableflag">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
          v-if="tableflag">
        </el-table-column>
        <el-table-column
          prop="kgvalue"
          label="千克重量"
          v-if="tableflag">
        </el-table-column>
        <el-table-column
          prop="seller"
          label="出售人"
          v-if="tableflag">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="出售人电话"
          v-if="tableflag">
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
          v-if="tableflag">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="总金额"
          v-if="tableflag">
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
  name: "Data",
  components: {
    Page
  },
  data() {
    return {
      sitedata: "",
      typeList: [],
      tableData: [],
      options4: [],
      value9: [],
      list: [],
      loading: false,
      tableflag: false,
      currentPage: 1,
      pagesize: 16,
      totalCount: 0,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: "",
      start: "",
      end: ""
    };
  },
  methods: {
    getsearch() {
      let para = {
        type: 1
      };
      this.$ajaxPost("getServiceSel", para).then(res => {
        this.list = res.data.result.map(item => {
          return { value: item.id, label: item.name };
        });
      });
    },
    getOneList() {
      if (this.value9 != "") {
        this.tableData = [];
        this.typeList = [];
        this.tableflag = true;
        let para = {
          q_recycdates: this.start,
          q_recycdatee: this.end,
          pagesize: this.pagesize,
          pnum: this.currentPage,
          q_serviceid: this.value9
        };
        this.$ajaxPost("recycling", para).then(res => {
          this.tableData = res.data.result;
        });
      }
    },
    getList() {
      let para = {
        q_recycdates: this.start,
        q_recycdatee: this.end,
        pagesize: this.pagesize,
        pnum: this.currentPage
      };
      this.$ajaxPost("getDataList", para).then(res => {
        console.log(res);
        this.tableData = res.data.result;
        this.totalCount = res.data.pager.totalCount;
      });
    },
    getType() {
      if (this.value9 == "") {
        this.typeList = [];
        this.tableflag = false;
        this.tableData = [];
        let para = {};
        this.$ajaxPost("columnList", para).then(res => {
          this.typeList = res.data.result;
          this.getList();
        });
      }
    },
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
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    }
  },
  mounted() {
    this.getType();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.data {
  padding: 6.625rem 4.375rem 0 4.375rem;
  box-sizing: border-box;
  background: #00289b;
  .seachbox {
    width: 100%;
    height: 3.125rem;
    line-height: 3.125rem;
    display: flex;
    // border: 1px solid #00ffff;
    margin-bottom: 2.1875rem;
    .seachbtn {
      padding: 0 2rem;
      height: 3.125rem;
      line-height: 3.125rem;
      background: #022ad6;
      text-align: center;
      cursor: pointer;
      margin-left: 1.25rem;
      border: 1px solid #00ffff;
      box-sizing: border-box;
      position: relative;
      top: 1px;
    }
    input {
      width: 18.75rem;
      height: 3.125rem;
      border: 1px solid #00ffff;
      padding: 0 0.9375rem;
      display: inline-block;
      background: #00144d;
      color: #fff;
      box-sizing: border-box;
      outline: none;
      margin-right: 0.3125rem;
    }
  }
  /deep/.el-input__inner {
    width: 19rem;
    height: 3.125rem;
    border: 1px solid #00ffff;
    padding: 0 2.6rem;
    display: inline-block;
    background: #00144d;
    color: #fff;
    box-sizing: border-box;
    outline: none;
    border-radius: 0;
    box-sizing: border-box;
    font-size: 0.875rem;
  }
  /deep/.el-select .el-input__inner {
    padding: 0 0.9375rem;
    width: 19rem;
    height: 3.125rem !important;
    outline: none;
    color: #fff;
    box-sizing: border-box;
    border: 1px solid #00ffff;
  }
  /deep/.el-select__input {
    width: 19rem;
    height: 3.125rem !important;
    outline: none;
    color: #fff;
    box-sizing: border-box;
  }
  /deep/.el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    margin: 0 1rem;
  }
  /deep/.el-table td,
  .el-table th {
    padding: 0;
  }
  /deep/.el-table .warning-row {
    background-color: #00144e;
  }
  /deep/.el-table {
    padding-bottom: 6.25rem;
    background: #00289b;
  }
  /deep/.el-table .success-row {
    background-color: #000e34;
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
      z-index: 9999;
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
