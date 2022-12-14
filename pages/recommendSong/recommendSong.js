// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: '',// 日期
    month: '',// 月份
    recommendList: [],// 推荐歌曲列表
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断用户是否登陆
    let userInfo = wx.getStorageInfoSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: function () {
          // 跳转登录界面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    // 更新日期
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.getRecommendList()

    // 订阅页面songDetail发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let { recommendList, index } = this.data
      if (type === 'pre') {// 上一首
        if (index == 0) {
          index = recommendList.length - 1
        } else {
          index -= 1
        }
      } else {// 下一首
        if (index == recommendList.length - 1) {
          index = 0
        } else {
          index += 1
        }
      }
      this.setData({
        index
      })
      let musicId = recommendList[index].id
      PubSub.publish('musicId', musicId)
    })
  },
  // 获取每日推荐的歌曲数据
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.data.dailySongs
    })
  },
  // 跳转至songDetail
  toSongDetail(event) {
    let { song, index } = event.currentTarget.dataset
    this.setData({
      index
    })
    // query参数传参
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?musicId=${song.id}`
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