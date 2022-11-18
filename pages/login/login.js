// pages/login/login.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 表单内容发生改变的回调
  handleinput(event) {
    let type = event.currentTarget.id// 获取传入的id判断是phone还是password
    this.setData({
      [type]: event.detail.value// 将输入框数据赋值给对应的phone或password
    })
  },
  // 登录回调
  async login() {
    let { phone, password } = this.data
    // 前端验证
    /* 
    手机号：
          1.内容为空
          2.格式错误
          3.验证通过
    */
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error'
      })
      return
    }
    // 定义正则表达式
    let phoneReg = /^1[3-9]\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'error'
      })
      return
    }
    // 密码验证
    if (!password) { // 因为使用的网易云接口，可以不写详细规则，详细规则参考网易官方
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
      return
    }
    // 后端验证
    // 服务器请求数据，isLogin判断是否是登录操作，由于前期考虑不全，未保存cookies，只能在此加入标识符，在封装函数request判断是否cookies
    let result = await request('/login/cellphone', { phone, password, isLogin: true })
    if (result.code == 200) {
      wx.showToast({
        title: '登陆成功',
        icon: 'success'
      })
      // 存储用户信息至本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      // 跳转回个人中心
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    } else if (result.code == 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'error'
      })
    } else if (result.code == 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'error'
      })
    } else {
      wx.showToast({
        title: '登陆失败,请重新登陆',
        icon: 'none'
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