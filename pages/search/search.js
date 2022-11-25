// pages/search/search.js
import request from '../../utils/request'
let timeout;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', // 默认搜索关键字
    hotSearchList: [], // 热搜榜数据
    searchContent: '', // 用户输入的表单项数据
    searchList: [], // 搜索列表
    historyList: [], // 搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData()
    this.getSearchHistory()
  },
  // 获取初始数据
  async getInitData() {
    // 获取默认搜索关键字
    let placeholderData = await request('/search/default')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword
    })
    let hotSearchListData = await request('/search/hot/detail')
    this.setData({
      hotSearchList: hotSearchListData.data
    })
  },
  // 搜索框改变回调
  handleInputChange(event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })
    this.debounce(this.getSearchList, 300)()
  },
  // 请求关键字匹配数据
  async getSearchList() {
    let { searchContent, historyList, searchList } = this.data
    if (!searchContent && searchList) {
      this.setData({
        searchList: []
      })
      return
    }
    let searchListData = await request('/search', { keywords: searchContent, limit: 10 })
    if (!searchListData.result.songs) {
      wx.showToast({
        title: '未找到歌曲，请重新输入',
        icon: 'none'
      })
    } else {
      this.setData({
        searchList: searchListData.result.songs
      })
    }
    // 添加搜索历史
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    wx.setStorageSync("searchHistory", historyList)
    this.setData({
      historyList
    })
  },
  // 防抖
  debounce(func, wait) {
    return () => {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(this)
      }, wait);
    }
  },
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: [],
    })
  },
  deleteSearchhistory() {
    wx.showModal({
      content: '确认删除',
      success: res => {
        if (res.confirm) {
          this.setData({
            historyList: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
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