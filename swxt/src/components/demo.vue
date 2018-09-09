<template>
  <div class="demo">
      <div class="baidumap" id="container" style="width:100%;height:100%;position:absolute;padding-bottom:4.2rem">
    </div>
    <div class="mapDialog" v-if="contentData.name">
      <div class="mapDialogTit">{{contentData.name}}</div>
      <div class="mapDialogContent">
        <b>开放时间</b>
        <p>{{contentData.amstime}} - {{contentData.pmetime}}</p>
        <b>负责人</b>
        <p>{{contentData.linkman}}</p>
        <b>联系电话</b>
        <p>{{contentData.phone}}</p>
        <b>可回收物</b>
        <p>{{contentData.memo}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
export default {
  name: "Page",
  data() {
    return {
      pageNo: 0,
      mapId: "",
      contentData: this.clickData
    };
  },
  props: {
    clickData: {
      type: Object,
      default: ""
    }
  },
  mounted() {
    this.baiduMap();
    console.log(this.contentData);
  },
  watch: {
    clickData(val) {
      this.contentData = val;
      this.baiduMap();
    }
  },
  methods: {
    // 返回
    goback() {
      this.$router.go(-1);
    },
    baiduMap() {
      var map = new BMap.Map("container");
      var point = new BMap.Point(121.47, 30.92);
      map.centerAndZoom(point, 15);
      var marker = new BMap.Marker(point); // 创建标注
      map.addOverlay(marker);
      var mapStyle = {
        styleJson: [
          {
            featureType: "water",
            elementType: "all",
            stylers: {
              visibility: "off"
            }
          },
          {
            featureType: "arterial",
            elementType: "geometry.fill",
            stylers: {
              color: "#002eb1ff"
            }
          },
          {
            featureType: "arterial",
            elementType: "geometry.stroke",
            stylers: {
              color: "#002eb1ff"
            }
          },
          {
            featureType: "local",
            elementType: "geometry",
            stylers: {
              color: "#002eb1ff"
            }
          },
          {
            featureType: "land",
            elementType: "all",
            stylers: {
              color: "#002294ff"
            }
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: {
              color: "#002eb2"
            }
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: {
              color: "#002294ff"
            }
          },
          {
            featureType: "building",
            elementType: "geometry",
            stylers: {
              color: "#002294ff"
            }
          },
          {
            featureType: "green",
            elementType: "geometry",
            stylers: {
              color: "#002294ff"
            }
          },
          {
            featureType: "green",
            elementType: "all",
            stylers: {
              color: "#002294ff",
              visibility: "off"
            }
          },
          {
            featureType: "boundary",
            elementType: "all",
            stylers: {
              color: "#002294ff"
            }
          },
          {
            featureType: "manmade",
            elementType: "geometry",
            stylers: {
              color: "#002294ff"
            }
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: {
              visibility: "off"
            }
          },
          {
            featureType: "boundary",
            elementType: "labels.icon",
            stylers: {
              visibility: "off"
            }
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: {
              color: "#002eb1ff"
            }
          },
          {
            featureType: "all",
            elementType: "labels.icon",
            stylers: {
              color: "#2294ff00",
              visibility: "off"
            }
          }
        ]
      };
      map.setMapStyle(mapStyle);
      var that = this;
      deletePoint(this.contentData, map);
      function addClickHandler(content, marker) {
        marker.addEventListener("click", function(e) {
          openInfo(content, e, map);
        });
      }
      function deletePoint(content, map) {
        // console.log(pointList);
        let para = {};
        that.$ajaxPost("listAll", para).then(res => {
          var pointList = res.data.result;
          var pointsView = []; //存放点的数组
          map.clearOverlays();
          for (let i = 0; i < pointList.length; i++) {
            var myIcon = new BMap.Icon(
              require("../assets/yuan.png"),
              new BMap.Size(40, 40),
              {
                // 指定定位位置
                offset: new BMap.Size(10, 25)
                // 当需要从一幅较大的图片中截取某部分作为标注图标时，需要指定大图的偏移位置
              }
            );
            var myIcon2 = new BMap.Icon(
              require("../assets/yuan2.png"),
              new BMap.Size(80, 80),
              { offset: new BMap.Size(10, 25) }
            );
            var point = new BMap.Point(pointList[i].lng, pointList[i].lat);
            if (pointList[i].id === content.id) {
              var marker = new BMap.Marker(point, { icon: myIcon2 });
            } else {
              var marker = new BMap.Marker(point, { icon: myIcon }); // 创建标注
            }
            map.addOverlay(marker);
            addClickHandler(pointList[i], marker, map); //加点击事件
            pointsView.push(point);
          }
          map.setViewport(pointsView);
        });
      }
      function openInfo(content, e, map) {
        deletePoint(content, map);
        that.contentData = content;
        that.mapId = content.id;
        that.clickfun(content);
      }
    },
    clickfun(val) {
      this.$emit("clickfun", val);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.demo {
  top: 0;
  padding-bottom: 20px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  .mapDialog {
    width: 16.25rem;
    height: 20.6rem;
    position: absolute;
    left: 60%;
    top: 45%;
    transform: translate(-50%, -50%);
    .mapDialogTit {
      width: 100%;
      height: 3.5rem;
      line-height: 3.5rem;
      font-weight: 600;
      font-size: 1.25rem;
    }
    .mapDialogContent {
      border: 1px solid #00ffff;
      width: 100%;
      padding: 1.25rem 1.875rem;
      padding-top: 0;
      box-sizing: border-box;
      background: rgba(13, 30, 87, 0.6);
      b {
        margin-top: 1.25rem;
        display: block;
        font-size: 1rem;
      }
      p {
        font-size: 0.875rem;
        margin: 0.625rem 0;
        line-height: 2rem;
      }
    }
  }
}
</style>
