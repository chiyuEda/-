const REQUEST = {
  userLogin: "/api/webuserlogin/login.rest", // 登录
  getSiteList: "/api/spoint/list.rest", // 站点列表
  getServiceSel: "/api/spoint/getServiceSel.rest", // 站点下拉
  getDataList: "/api/recycling/statsList.rest", // 分类列表
  columnList: "/api/category/columnList.rest", // 分类类别
  recycling: "/api/recycling/list.rest", // 详情
  spointAll: "/api/stats/spointAll.rest", // 柱状图
  spointCycleList: "/api/stats/spointCycleList.rest", // 折线图
  spointPercent: "/api/stats/spointPercent.rest", // 饼图
  workingList: "/api/camera/workingList.rest", // 监控列表
  listAll: "/api/spoint/listAll.rest", // 首页所有站点列表
  spointDW: "/api/stats/spointDW.rest", // （首页）服务点单日/周回收量统计
  spointSevenD: "/api/stats/spointSevenD.rest", // （首页）服务点七日日回收总量统计
  platTotal: "/api/stats/platTotal.rest", // （首页）平台总量趋势统计
  platPercent: "/api/stats/platPercent.rest", // （首页）平台各分类占总量百分比统计
  info: '/api/spoint/info.rest'
}

export default REQUEST;
