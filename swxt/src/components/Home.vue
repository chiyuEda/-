<template>
  <div class="home">
    <demo @clickfun="clickfun" :clickData="clickData"></demo>
    <div class="homecontent">
      <div class="homeFirst">
        <div class="firstHead">
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
          <div class="seachbtn" @click="getCharts();getTopInfo();getInfo()">搜索</div>
        </div>
        </div>
        <div class="fircenter">
          <p>站点名称：{{leftList.name}}</p>
          <!-- <p>服务点A</p> -->
        </div>
        <div class="firbottom">日回收量<span>{{leftList.dstats}}KG</span></div>
        <div class="firbottom">周回收量<span>{{leftList.wstats}}KG</span></div>
      </div>
      <div class="homeSecond">
        <div class="botLeft">
              <div class="leftHead">
                <div class="lHLeft">
                  <div>{{searchTxt}}趋势</div>
                  <img src="../assets/icon_huishou.png" @click="changeChoose">
                </div>
                <div class="shouDown" v-if="showDown">
                  <div @click="searchTxt='回收总量';showDown=false;searchType='';getCharts()">回收总量</div>
                  <div @click="searchTxt='可回收物';showDown=false;searchType=0;getCharts()">可回收物</div>
                  <div @click="searchTxt='不可回收物';showDown=false;searchType=1;getCharts()">不可回收物</div>
                </div>
                <div class="lHRight">
                  <ul>
                    <li :class="{active:flag==0}" @click="flag=0;getCharts()">日</li>
                    <li :class="{active:flag==1}" @click="flag=1;getCharts()">月</li>
                    <li :class="{active:flag==2}" @click="flag=2;getCharts()">周</li>
                  </ul>
                </div>
            </div>
            <div id="main1" style="width: 26.25rem;height:16.25rem;"></div>
            </div>
      </div>
      <div class="homeThird">
        <div class="botLeft">
          <div class="leftHead">
            <div class="lHLeft">
              <div>{{searchTxt}}七日趋势</div>
            </div>
          </div>
          <div id="main3" style="width: 26.25rem;height:16.25rem;"></div>
        </div>
      </div>
      <div class="homeFourth">
        <div class="botRight">
          <div id="main2" style="width: 24rem;height: 18rem;"></div>
        </div>
      </div>
    </div>
    <div class="homeBottom">
      <div class="bottomContent">
        <div class="homeVideo">
          <el-row :gutter="20">
          <el-col :span="4" v-for="(item,key) in videoList" :key="key">
            <div class="grid-content bg-purple" @click="openVideo(item)">
              <div>{{item.servicename}} {{item.name}}</div>
              <iframe :src="item.url+'&autoplay=1'" style="width:100%;" frameborder="0"></iframe>
            </div>
          </el-col>
        </el-row>
        </div>
        <router-link to="/video">
          <div class="homeMore">
            <div>查看更多</div>
            <div class="moreImg">
              <img src="../assets/xiangyou.png" alt="">
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <el-dialog 
    :visible.sync="dialogTableVisible"
    :show-close="false">
    <!-- :close-on-click-modal="false" -->
    <div class="dialogHead">
      <div class="dialogHeadText">{{dialogList.servicename}} {{dialogList.name}}</div>
      <img src="../assets/suoxiao_min.png" alt="" class="closeDialog" @click="dialogTableVisible=false">
    </div>
    <!-- <video poster="../assets/video_img.jpg" :src="dialogList.url" class="dialogImg"></video> -->
      <iframe :src="dialogList.url+'&autoplay=1'" style="width:100%;height:500px" frameborder="0"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import demo from "./demo";
export default {
  name: "Home",
  components: {
    demo
  },
  data() {
    return {
      clickData: {},
      leftList: "",
      xzzt: [],
      yzzt: [],
      xzxt: [],
      yzxt: [],
      xbt: [],
      ybt: [],
      flag: 0,
      searchType: "",
      qrxzxt: [],
      qryzxt: [],
      searchTxt: "回收总量",
      options4: [],
      value9: "",
      list: [],
      loading: false,
      dialogTableVisible: false,
      videoList: [],
      dialogList: "",
      showDown: false
    };
  },
  methods: {
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
    getVideoList() {
      let para = {
        pnum: 1,
        pagesize: 6
      };
      this.$ajaxPost("workingList", para).then(res => {
        this.videoList = res.data.result;
        this.totalCount = res.data.pager.totalCount;
      });
    },
    openVideo(val) {
      console.log(val);
      this.dialogTableVisible = true;
      this.dialogList = val;
    },
    getsearch() {
      let para = {
        type: this.searchType
      };
      this.$ajaxPost("getServiceSel", para).then(res => {
        this.list = res.data.result.map(item => {
          return { value: item.id, label: item.name };
        });
      });
    },
    getCharts() {
      this.getzxt();
      this.getbt();
      this.getqrzxt();
    },
    getzxt() {
      let para = {
        type: this.searchType,
        cycle: this.flag
      };
      this.$ajaxPost("platTotal", para).then(res => {
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
    getqrzxt() {
      let para = {
        type: this.searchType,
        id: this.value9
      };
      this.$ajaxPost("spointSevenD", para).then(res => {
        this.qrxzxt = [];
        this.qryzxt = [];
        res.data.result.map(item => {
          this.qrxzxt.push(item.date);
          this.qryzxt.push(item.weight);
        });
        setTimeout(() => {
          this.qrzxtCharts();
        }, 200);
      });
    },
    qrzxtCharts() {
      var myChart1 = echarts.init(document.getElementById("main3"));
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
          data: this.qrxzxt,
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
            name: this.searchTxt + "趋势",
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
            data: this.qryzxt
          }
        ]
      };
      myChart1.setOption(option1);
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
            name: this.searchTxt + "趋势",
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
    getbt() {
      let para = {
        type: this.searchType
      };
      this.$ajaxPost("platPercent", para).then(res => {
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
    changeChoose() {
      this.showDown = true;
    },
    btCharts() {
      var myChart2 = echarts.init(document.getElementById("main2"));
      var option2 = {
        title: {
          text: this.searchTxt,
          x: "left",
          y: "1",
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
          formatter: "{b}:{c}: ({d}%)",
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
        legend: {
          orient: "vertical",
          x: "left",
          y: "30",
          data: this.xbt,
          textStyle: {
            color: [
              "#f96502",
              "#c202f9",
              "#f9c802",
              "#00d582",
              "#d60239",
              "#022ad6",
              "#00ffff"
            ],
            fontSize: "12"
          }
        },
        series: [
          {
            name: this.searchTxt,
            type: "pie",
            radius: "55%",
            center: ["55%", "50%"],
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
    },
    clickfun(val) {
      this.options4 = [{ value: val.id, label: val.name }];
      this.value9 = val.id;
      this.getCharts();
      this.getTopInfo();
    },
    getTopInfo() {
      let para = {
        id: this.value9,
        type: this.searchType
      };
      this.$ajaxPost("spointDW", para).then(res => {
        this.leftList = res.data.result;
      });
    },
    getInfo() {
      let para = {
        id: this.value9
      };
      this.$ajaxPost("info", para).then(res => {
        this.clickData = res.data.result;
      });
    }
  },
  mounted() {
    this.getCharts();
    this.getTopInfo();
    this.getVideoList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  position: absolute;
  padding-top: 5rem;
  box-sizing: border-box;
  .homecontent {
    padding: 1.875rem 3.75rem;
  }
  .shouDown {
    position: absolute;
    z-index: 8888;
    top: 2rem;
    div {
      background: url("../assets/echarts_huishou.png") no-repeat center;
      background-size: 100% 100%;
      padding: 0 1.25rem;
      height: 1.5625rem;
      line-height: 1.5625rem;
      text-align: center;
      margin: 0.625rem 0;
      cursor: pointer;
    }
  }
  .seachbox {
    height: 1.875rem;
    line-height: 1.875rem;
    display: flex;
    overflow: hidden;
    margin-top: 1rem;
    .seachbtn {
      height: 1.875rem;
      line-height: 1.875rem;
      background: #022ad6;
      text-align: center;
      width: 4.6875rem;
      cursor: pointer;
      box-sizing: border-box;
      border: 0;
    }
  }
  /deep/.el-select .el-input__inner {
    height: 1.875rem;
    line-height: 1.875rem;
    display: inline-block;
    background: #001553;
    box-sizing: border-box;
    border: 0;
    border-radius: 0;
    font-size: 0.875rem;
    padding: 0 0.9375rem;
    outline: none;
    color: #fff;
    box-sizing: border-box;
  }
  /deep/.el-select__input {
    height: 1.875rem;
    line-height: 1.875rem;
    outline: none;
    color: #fff;
    box-sizing: border-box;
  }
  .homeFirst {
    width: 19.6875rem;
    height: 20rem;
    background: url("../assets/sever_bg.png") no-repeat center;
    background-size: 100% 100%;
    text-align: center;
    padding: 1.875rem 3.75rem;
    box-sizing: border-box;
    position: absolute;
    z-index: 9;
    .firstHead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.875rem;
      span {
        display: inline-block;
        height: 1.875rem;
        line-height: 1.875rem;
      }
      .firsearchbtn {
        width: 4.6875rem;
        height: 1.875rem;
        line-height: 1.875rem;
        color: #fff;
        background: #022ad6;
      }
    }
    .fircenter {
      border-bottom: 1px solid #00ffff;
      p {
        padding-bottom: 1.25rem;
        font-size: 0.625rem;
        line-height: 2rem;
      }
    }
    .firbottom {
      margin-top: 1.25rem;
      font-size: 0.75rem;
      span {
        color: #00ffff;
        font-weight: 600;
        font-size: 1.25rem;
        margin-left: 1.25rem;
      }
    }
  }
  .homeSecond {
    width: 26.25rem;
    height: 21.25rem;
    position: absolute;
    right: 3.75rem;
    top: 7.5rem;
    z-index: 9;
  }
  .leftHead {
    margin-bottom: 2.5rem;
    display: flex;
    justify-content: space-between;
    .lHLeft {
      display: flex;
      align-items: center;
      div {
        padding: 0 1.25rem;
        height: 1.5625rem;
        line-height: 1.5625rem;
        background: url("../assets/echarts_huishou.png") no-repeat center;
        background-size: 100% 100%;
        text-align: center;
        display: inline-block;
        margin-right: 1.25rem;
      }
      img {
        height: 1.5rem;
        cursor: pointer;
      }
    }
    .lHRight {
      float: right;
      ul {
        display: flex;
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
  }
  .homeThird {
    position: absolute;
    left: 3.75rem;
    top: 34rem;
    z-index: 9;
  }
  .botLeft {
    flex: 1;
  }
  .homeFourth {
    position: absolute;
    right: 3.75rem;
    top: 34rem;
    z-index: 9;
  }
  .botRight {
    background: url("../assets/sever_bg.png") no-repeat center;
    background-size: 100% 100%;
    padding: 1.875rem 2.5rem;
    box-sizing: border-box;
    margin-left: 4rem;
    width: 24rem;
    height: 18rem;
    text-align: center;
    color: #fff;
  }

  .homeBottom {
    width: 100%;
    height: 15rem;
    position: absolute;
    bottom: 2rem;
    padding: 0 3.75rem;
    box-sizing: border-box;
    .bottomContent {
      background: url("../assets/db.png") no-repeat center;
      background-size: 100% 100%;
      width: 100%;
      height: 100%;
      padding: 1rem 1.875rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      a {
        display: block;
        color: #fff;
        text-decoration: none;
      }
      .homeMore {
        width: 4rem;
        font-size: 0.75rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 0.5rem;
        .moreImg {
          background: rgba(0, 12, 51, 0.8);
          width: 3.75rem;
          height: 8.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 60%;
          }
        }
      }
      .homeVideo {
        flex: 1;
      }
    }
  }
  .grid-content {
    width: 19.375rem;
    height: 15rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    div {
      width: 15rem;
      height: 2.5rem;
      line-height: 2.5rem;
      background: #001553;
      margin-bottom: 1rem;
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
