import request from '../../../utils/request';
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 年 月 日 数据
    day : "",
    month : "",
    year : "" ,
    // 推荐列表数据
    recommendList : [],
    // 点击音乐的下标
    index : 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo) {
      wx.showToast({
        title: "请先登录",
        icon : "none",
        success : () => {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }

    // 更新日期数据
    let date = new Date();
    this.setData({
      day : date.getDate(),
      month : date.getMonth() + 1 , 
      year : date.getFullYear(),
    })

    this.getRecommendList();
    
    // 订阅来自songDetail的消息
    PubSub.subscribe('switchType',(msg,type) => {
      // console.log(msg,type);
      let {recommendList,index} = this.data;
      if("pre" === type) {  // 上一首
        (index === 0) && (index = recommendList.length);
        index = index - 1;
      }else if("next" === type){ //下一首
        (index == recommendList.length-1) && (index = -1) ;
        index = index + 1;
      }
      this.setData({
        index
      });
      let musicId = recommendList[index].id;
      // 回传
      PubSub.publish("musicId",musicId);

    })

  },
  // 获取用户每日推荐
  async getRecommendList(){
    let recommendListData = await request("recommend/songs")
    this.setData({
      recommendList : recommendListData.recommend
    });
  },

  // 跳转歌曲详情页（播放页）
  toSongDetail(e){
    let {song,index} = e.currentTarget.dataset;
    this.setData({
      index
    })
    // 路由跳转传参
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?musicId='+ song.id,
    });
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})