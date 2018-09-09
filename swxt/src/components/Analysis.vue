<template>
  <div class="analysis">
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
      <el-select
        clearable
        style="margin-left:10px;"
        v-model="type" @change="changeType">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <div class="block">
        <el-date-picker
          v-model="start"
          align="right"
          type="date"
          placeholder="选择开始日期"
          format="yyyy.MM.dd"
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
          format="yyyy.MM.dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions1">
        </el-date-picker>
      </div>
      <div class="seachbtn" @click="getallCharts">搜索</div>
    </div>
    <div class="analysisContent" v-show="chartsShow">
      <div class="contentTop">
        <el-row>
          <el-col :span="24">
            <div id="main" style="width: 100%;height:450px;"></div>
          </el-col>
        </el-row>
      </div>
      <div class="contentBot">
            <div class="botLeft">
              <div class="leftHead">
              <div class="lHLeft">{{itemTxt}}趋势</div>
              <div class="lHRight">
                <ul>
                  <li :class="{active:flag==0}" @click="flag=0;getzxt()">日</li>
                  <li :class="{active:flag==1}" @click="flag=1;getzxt()">月</li>
                  <li :class="{active:flag==2}" @click="flag=2;getzxt()">周</li>
                </ul>
              </div>
            </div>
            <div id="main1" style="width: 100%;height:20rem;"></div>
            </div>
            <div class="botRight">
              <div id="main2" style="width: 100%;height:21rem;"></div>
            </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Analysis",
  data() {
    return {
      xzzt: [],
      yzzt: [],
      xzxt: [],
      yzxt: [],
      xbt: [],
      ybt: [],
      chartsShow: false,
      options4: [],
      value9: [],
      list: [],
      itemTxt: "总回收量",
      typeList: [
        { name: "回收总量", code: "" },
        { name: "可回收物", code: "0" },
        { name: "不可回收物", code: "1" }
      ],
      loading: false,
      flag: 0,
      type: "",
      states: [],
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
    changeType() {
      if (this.type == "") {
        this.itemTxt = "回收总量";
      } else if (this.type == 0) {
        this.itemTxt = "可回收物";
      } else if (this.type == 1) {
        this.itemTxt = "不可回收物";
      }
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
    },
    getsearch() {
      let para = {
        type: this.type
      };
      this.$ajaxPost("getServiceSel", para).then(res => {
        this.list = res.data.result.map(item => {
          return { value: item.id, label: item.name };
        });
      });
    },
    getallCharts() {
      this.chartsShow = true;
      this.getzzt();
      this.getzxt();
      this.getbt();
    },
    getzzt() {
      let para = {
        type: this.type,
        recycdates: this.start,
        recycdatee: this.end
      };
      this.$ajaxPost("spointAll", para).then(res => {
        this.xzzt = [];
        this.yzzt = [];
        res.data.result.map(item => {
          this.xzzt.push(item.servicename);
          this.yzzt.push(item.weight);
        });
        setTimeout(() => {
          this.zztCharts();
        }, 200);
      });
    },
    getbt() {
      let para = {
        type: this.type,
        recycdates: this.start,
        recycdatee: this.end,
        serviceid: this.value9
      };
      this.$ajaxPost("spointPercent", para).then(res => {
        this.xbt = [];
        this.ybt = [];
        res.data.result.map(item => {
          this.xbt.push(item.name);
          this.ybt.push({
            value: item.weight,
            name: item.name
          });
        });
        setTimeout(() => {
          this.btCharts();
        }, 200);
      });
    },
    getzxt() {
      let para = {
        type: this.type,
        recycdates: this.start,
        recycdatee: this.end,
        cycle: this.flag,
        serviceid: this.value9
      };
      this.$ajaxPost("spointCycleList", para).then(res => {
        this.xzxt = [];
        this.yzxt = [];
        res.data.result.map(item => {
          this.xzxt.push(item.date);
          this.yzxt.push(item.weight);
        });
        setTimeout(() => {
          this.zxtCharts();
        }, 200);
      });
    },
    zztCharts() {
      var myChart = echarts.init(document.getElementById("main"));
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          splitLine: { show: false },
          type: "category",
          data: this.xzzt,
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#00ffff", //左边线的颜色
              width: "2" //坐标线的宽度
            }
          },
          axisLabel: {
            textStyle: {
              color: "#fff" //坐标值得具体的颜色
            }
          },
          axisTick: {
            show: false
          }
        },
        dataZoom: [
          {
            type: "inside",
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 20,
            fillerColor: "#00289b",
            backgroundColor: "#00289b"
          }
        ],
        yAxis: {
          splitLine: { show: false },
          type: "value",
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#00ffff",
              width: "2"
            }
          },
          max: function(value) {
            return value.max + 100;
          },
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            data: this.yzzt,
            type: "bar",
            barWidth: 30,
            itemStyle: {
              normal: {
                color: ["#00ffff"]
              },
              splitLine: { show: false }
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    zxtCharts() {
      var myChart1 = echarts.init(document.getElementById("main1"));
      var option1 = {
        backgroundColor: "", //背景颜色透明
        grid: {
          left: 0,
          top: "5%",
          left: 0,
          bottom: "5%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        toolbox: {
          show: true
        },
        xAxis: {
          type: "category",
          data: this.xzxt,
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#00ffff",
              width: "1"
            }
          },
          nameLocation: "middle"
        },
        yAxis: {
          type: "value",
          splitLine: { show: false }, //去除网格线
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#00ffff",
              width: "1"
            }
          }
        },
        color: ["#1DB0B8", "#37C6C0", "#D0E9FF", "#c7353a", "#f5b91e"],
        series: [
          {
            name: this.itemTxt + "趋势",
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              color: "#6A5ACD",
              normal: {
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 2,
                  type: "solid",
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#0000FF"
                    },
                    {
                      offset: 1,
                      color: "#CD5C5C"
                    }
                  ]) //线条渐变色
                }
              },
              emphasis: {
                color: "#6A5ACD",
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 2,
                  type: "dotted",
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#1E90FF"
                    },
                    {
                      offset: 1,
                      color: "#0000FF"
                    }
                  ])
                }
              }
            }, //线条样式
            areaStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(80,141,255,0.6)"
                  },
                  {
                    offset: 0.34,
                    color: "rgba(56,155,255,0.25)"
                  },
                  {
                    offset: 1,
                    color: "rgba(38,197,254,0.00)"
                  }
                ])
              }
            }, //区域颜色渐变
            data: this.yzxt
          }
        ]
      };
      myChart1.setOption(option1);
    },
    btCharts() {
      var myChart2 = echarts.init(document.getElementById("main2"));
      var option2 = {
        title: {
          text: this.itemTxt,
          x: "left",
          y: "5",
          textStyle: {
            color: "#fff",
            fontSize: "16"
          }
        },
        color: function(params) {
          var colorarrays = [
            "#f96502",
            "#c202f9",
            "#f9c802",
            "#00d582",
            "#d60239",
            "#022ad6",
            "#00ffff",
            "#2F9323",
            "#D9B63A",
            "#2E2AA4",
            "#9F2E61",
            "#4D670C",
            "#BF675F",
            "#1F814A",
            "#357F88",
            "#673509",
            "#310937",
            "#1B9637",
            "#F7393C"
          ];
          return colorarrays[params.dataIndex];
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          textStyle: {
            color: "#fff",
            fontSize: "12"
          }
        },
        legend: {
          orient: "vertical",
          x: "left",
          y: "30",
          data: this.xbt,
          textStyle: {
            color: function(params) {
              var colorarrays = [
                "#f96502",
                "#c202f9",
                "#f9c802",
                "#00d582",
                "#d60239",
                "#022ad6",
                "#00ffff",
                "#2F9323",
                "#D9B63A",
                "#2E2AA4",
                "#9F2E61",
                "#4D670C",
                "#BF675F",
                "#1F814A",
                "#357F88",
                "#673509",
                "#310937",
                "#1B9637",
                "#F7393C"
              ];
              return colorarrays[params.dataIndex];
            },
            fontSize: "12"
          }
        },
        series: [
          {
            name: this.itemTxt,
            type: "pie",
            radius: "55%",
            center: ["70%", "50%"],
            label: {
              normal: {
                show: false,
                position: "center"
              }
            },
            data: this.ybt,
            // [
            //   { value: 335, name: "金属类" },
            //   { value: 310, name: "玻璃类" },
            //   { value: 234, name: "低碳类" },
            //   { value: 135, name: "衣物类" },
            //   { value: 154, name: "泡沫类" },
            //   { value: 135, name: "塑料类" },
            //   { value: 158, name: "其他" }
            // ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart2.setOption(option2);
    }
  },
  mounted() {
    this.getallCharts();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.analysis {
  padding: 6.25rem 6.25rem 0 6.25rem;
  box-sizing: border-box;
  background: #00289b;
  .seachbox {
    width: 100%;
    height: 3.125rem;
    line-height: 3.125rem;
    display: flex;
    // border: 1px solid #00ffff;
    margin-bottom: 2.1875rem;
    padding-left: 8rem;
    box-sizing: border-box;
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
  .analysisContent {
    width: 100%;
    .contentBot {
      margin-top: 2rem;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
      padding: 0 10rem;
    }
    .lHLeft {
      width: 7.875rem;
      height: 1.5625rem;
      line-height: 1.5625rem;
      background: url("../assets//echarts_huishou.png") no-repeat center;
      background-size: 100% 100%;
      text-align: center;
      display: inline-block;
      margin-bottom: 2rem;
    }
    .lHRight {
      float: right;
      margin-right: 6rem;
      ul {
        li {
          list-style: none;
          float: left;
          width: 3.625rem;
          height: 1.5625rem;
          line-height: 1.5625rem;
          text-align: center;
          background: #00144d;
          margin: 0 0.3rem;
          cursor: pointer;
        }
        li.active {
          border: #00ffff solid 1px !important;
          background: #022ad6 !important;
        }
      }
    }
    .botLeft {
      flex: 1;
    }
    .botRight {
      background: url("../assets/sever_bg.png") no-repeat center;
      background-size: 100% 100%;
      padding: 1.875rem 2.5rem;
      box-sizing: border-box;
      margin-left: 4rem;
      width: 30rem;
      text-align: center;
      color: #fff;
    }
  }
}
</style>
