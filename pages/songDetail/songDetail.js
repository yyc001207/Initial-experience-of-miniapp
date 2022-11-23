// pages/songDetail/songDetail.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,// 是否播放标识
    song: {},// 歌曲详情对象
    songLink: '', // 歌曲地址url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let musicId = options.musicId
    this.getMusicDetail(musicId)
    this.getMusicLink(musicId)
  },
  // 点击播放/暂停
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    this.musicControl(isPlay)
  },
  // 获取歌曲详情 
  async getMusicDetail(musicId) {
    let songData = await request('/song/detail', { ids: musicId })
    this.setData({
      song: songData.songs[0]
    })
    // 动态修改标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  // 获取音乐播放链接
  async getMusicLink(musicId) {
    let musicLinkData = await request('/song/url', { id: musicId })
    this.setData({
      songLink: musicLinkData.data[0].url
    })
  },
  // 控制音乐播放/暂停函数
  musicControl(isPlay) {
    let backgroundAudioManager = wx.getBackgroundAudioManager()
    if (isPlay) {// 音乐播放
      // 创建控制实例
      backgroundAudioManager.src = this.data.songLink
      backgroundAudioManager.title = this.data.song.name
    } else {// 音乐暂停
      backgroundAudioManager.pause()
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