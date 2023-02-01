//发送ajax请求
import config from './config'

export default (router,data={},method="GET") => {
  return new Promise((resolve,reject)=>{
    wx.request({
      url : config.host+router,
      data,
      method,
      header : {
        cookie :wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      },
      success:(e) => {
        if(data.isLogin){
          wx.setStorage({
            data: e.cookies,
            key: 'cookies'
          })
        }
        resolve(e.data);
      },
      fail:(err) => {
        reject(err);
      }
    })
  });
}


// 我的方法
// export default (router,data={},method="GET",success,fail) => {
//   wx.request({
//     url : config.host+router,
//     data,
//     method,
//     success,
//     fail
//   })
// }