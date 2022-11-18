// pages/personal/personal.js
import request from '../../utils/request'
let startY = 0//其实坐标
let moveY = 0//移动坐标
let moveDistance = 0//移动距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {},
    recentPlayList: [],// 用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 本地读取用户信息
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo),
      })
      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },
  // 避免生命周期使用async
  // 用户播放
  async getUserRecentPlayList(uid) {
    let recentPlayListData = await request('/user/record', { uid, type: 1 })
    let index = 0// 添加唯一标识
    let recentPlayList = recentPlayListData.weekData.splice(0, 10).map(item => {
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList
    })
  },
  // 下拉动画实现
  handleTouchStart(event) {// 开始下拉，获取起始点
    startY = event.touches[0].clientY
  },
  handleTouchMove(event) {// 下拉进行中移动的距离
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY// 移动距离
    if (moveDistance <= 0) {// 禁止上拉
      return
    } else if (moveDistance >= 80) {// 下拉最大距离限制
      moveDistance = 80
    }
    this.setData({
      coverTransition: '',// 重置css的transform只应用于回弹
      coverTransform: `translateY(${moveDistance}rpx)`// 回弹起始点
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: 'translateY(0)',// 回弹终点
      coverTransition: 'transform 0.5s linear'// 回弹动画
    })
  },
  // 跳转登录页
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
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