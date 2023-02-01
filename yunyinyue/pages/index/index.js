import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList :[],     //轮播图数据
    recommendList:[],   //推荐歌曲
    topList: [],        //排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //轮播图数据
    let banner = await request("banner",{type:1});
    this.setData({
      bannerList : banner.banners
    });
    //推荐歌曲数据
    let recommend = await request("personalized",{limit : 10})
    this.setData({
      recommendList : recommend.result
    });
    //排行榜数据
    let toplistArr = [];
    for (let i = 0; i <= 4; i++) {
      let toplist = await request("top/list",{idx : i});
      let toplistitem = {
        name : toplist.playlist.name,
        tracks: toplist.playlist.tracks.slice(0,3)
      };
      toplistArr.push(toplistitem);
      this.setData({
        topList : toplistArr
      });
    }

    
    // 我的方法
    // request("banner",{
    //   type:1
    // },
    // function(e){
    //   console.log(e);
    // },function(err){
    //   console.log(err);
    // })
  },

  // 跳转到recommmendSong
  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    })
  },
  toOther(){
    wx.navigateTo({
      url: '/otherPackage/pages/other/other',
    })
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