// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],// 导航标签数据
    navId: '',//导航标识
    videoList: [],//视频列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取导航数据
    this.getVideoGroupListData()
  },
  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupList = []
    let videoGroupListData = await request('/video/group/list')// 服务器请求数据
    videoGroupListData.data.slice(0, 14).forEach(item => {// 屌毛网易这几个分类不给数据
      if (item.name !== '万有引力' && item.name !== 'MV') {
        videoGroupList.push(item)
      }
    })
    this.setData({
      videoGroupList,
      navId: videoGroupListData.data[0].id // 初始导航id，后面随着点击不同改变id 
    })
    wx.showLoading({// 初始化数据显示前放一个加载动画
      title: '正在加载'
    })
    // 获取视频列表
    this.getVideoList(this.data.navId) // 根据初始导航id获取初始视频列表数据
  },
  // 获取视频列表
  async getVideoList(navId) {
    if (!navId) {// 判断导航id是否存在，
      return
    }
    let videoListData = await request('/video/group', { id: navId })// 获取对应导航id的视频列表数据
    let index = 0 // 网易不给唯一值，自己添加唯一值
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    let vid = [] // 网易给的数据没有视频地址，需要用另一个接口获取，这里是取保存在视频列表数据中的视频的vid
    videoList.forEach(item => {
      vid.push(item.data.vid)
    })
    let i = 0// 循环
    let urlList = []// 保存所有的url对象的数组
    while (i < vid.length) {
      let videoUrlData = await request('/video/url', { id: vid[i++] })// 请求视频url
      urlList.push(videoUrlData.urls[0])// 保存url
    }
    for (let i = 0; i < videoList.length; i++) {
      videoList[i].data.urlInfo = urlList[i]// 将url保存在视频列表数据中，方便页面获取数据
    }
    this.setData({
      videoList,
    })
    setTimeout(() => {
      wx.hideLoading()// 关闭加载动画
    }, 300)
  },
  // 点击切换导航
  changeNav(event) {
    let navId = event.currentTarget.id// 获取导航id
    this.setData({
      navId,
      videoList: []
    })
    wx.showLoading({// 开启加载动画，优化用户体验
      title: '正在加载'
    })
    // 动态获取当前导航的数据
    this.getVideoList(this.data.navId)// 调用获取对应导航id的视频列表 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})