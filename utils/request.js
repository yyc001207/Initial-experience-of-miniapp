import { host } from "../utils/config";
// 发请求
export default (url, data = {}, method = 'get') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url,
            data,
            method,
            header:
            {
                cookie: wx.getStorageSync('cookies').length ?// 判断cookies是否存在，网易在这里有多个cookie，我们使用带有MUSIC_U的
                    wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
            },
            success: (result) => {
                if (data.isLogin) {// 判断是否是登录操作
                    // 保存用户cookies
                    wx.setStorage({
                        key: 'cookies',
                        data: result.cookies// cookies保存至本地
                    })
                }
                resolve(result.data)
            },
            fail: (err) => {
                reject(err)
            },
        });
    })
}