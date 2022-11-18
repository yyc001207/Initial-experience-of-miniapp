// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],//轮播图
    recommendList: [],//推荐歌单
    topList: [],//排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获取首页轮播图数据
    let bannerListData = await request('/banner', { type: 2 })
    this.setData({
      bannerList: bannerListData.banners
    })
    // 获取推荐歌单
    let recommendListData = await request('/personalized', { limit: 10 })
    this.setData({
      recommendList: recommendListData.result
    })
    // 获取排行榜
    let topId = []
    let topListData = await request('/toplist/detail')// 获取全部榜单
    topListData.list.slice(0, 5).forEach(item => {
      topId.push(item.id)// 获取榜单的id，我只要5个
    });
    let index = 0
    let topListItem = []
    while (index < 5) {
      let topListDetail = await request('/playlist/detail', { id: topId[index++] })// 根据获取的id获取榜单详情
      let topListDetailItem = { name: topListDetail.playlist.name, tracks: topListDetail.playlist.tracks.slice(0, 3) }// 修改数据结构
      topListItem.push(topListDetailItem)
      this.setData({
        topList: topListItem
      })
    }
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