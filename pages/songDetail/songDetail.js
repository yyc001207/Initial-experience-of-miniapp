// pages/songDetail/songDetail.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
// 获取全局实例
const appInstance = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,// 是否播放标识
    song: {},// 歌曲详情对象
    musicLink: '', // 歌曲地址url
    musicId: '',// 歌曲id
    currentTime: '00:00',// 歌曲播放实时时长
    durationTime: '00:00',// 歌曲总时长
    currentWidth: 0,// 实时进度条长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicDetail(musicId)
    // 判断音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 修改音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }

    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    // 监听播放/暂停
    this.backgroundAudioManager.onPlay(() => {
      // 修改播放状态
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 监听播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 100
      this.setData({
        currentTime,
        currentWidth
      })
    })
    // 监听播放结束
    this.backgroundAudioManager.onEnded(() => {
      // 切换至下一首音乐
      this.publishData()
      PubSub.publish('switchType', 'next')
      // 还原进度条
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })
  },
  // 修改状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },
  // 点击播放/暂停
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },
  // 获取歌曲详情 
  async getMusicDetail(musicId) {
    let songData = await request('/song/detail', { ids: musicId })
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    if (songData.songs[0].fee == 1) {
      durationTime = moment(30000).format('mm:ss')
      wx.showToast({
        title: '会员歌曲试听30秒',
        icon: 'none'
      })
    }
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    // 动态修改标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  // 控制音乐播放/暂停函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {// 音乐播放
      // 创建控制实例
      if (!musicLink) {
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url', { id: musicId });
        musicLink = musicLinkData.data[0].url;

        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.title = this.data.song.name
      this.backgroundAudioManager.src = musicLink
    } else {// 音乐暂停
      this.backgroundAudioManager.pause()
    }
  },
  // 切歌 
  handleSwitch(event) {
    this.backgroundAudioManager.stop()
    // 获取切歌类型
    let type = event.currentTarget.id
    // 订阅recommendSong页面发布的musicId
    this.publishData()
    // 发布消息
    PubSub.publish('switchType', type)
  },
  // 消息发布
  publishData() {
    PubSub.subscribe('musicId', (msg, musicId) => {
      this.getMusicDetail(musicId)
      this.musicControl(true, musicId)
      PubSub.unsubscribe('musicId')
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