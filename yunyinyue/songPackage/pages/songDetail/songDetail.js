import request from '../../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 音乐是否播放
    isPlay : false, 
    // 歌曲详情对象
    song : {},
    // 歌曲播放地址
    url : "",
    // 当前播放的音乐的id
    musicId : "" , 
    // 总时长
    durationTime : "00:00" , 
    // 已播放时长
    currentTime : "00:00",
    // 实时进度条长度
    currentWidth : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.getMusicInfo(musicId);
    this.setData({
      musicId
    })
  },
  // 获取音乐详情
  async getMusicInfo(id){
    let res = await request('song/detail',{ids : id});
    let durationTime = moment(res.songs[0].dt).format('mm:ss');
    this.setData({
      song : res.songs[0],
      durationTime
    })
    // 更新页面标题
    wx.setNavigationBarTitle({
      title : this.data.song.name
    })

    // 判断当前页面的否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === id) {
      this.setData({
        isPlay : true
      })
    }

    // 音乐播放管理实例
    this.manager = wx.getBackgroundAudioManager();

    // 音乐播放、暂停、停止的监听
    this.manager.onPlay(() => {
      this.changePlayState(true);
      appInstance.globalData.musicId = id;
    });
    this.manager.onPause(() => {
      this.changePlayState(false);
    });
    this.manager.stop(() => {
      this.changePlayState(false);
    });
    this.manager.onTimeUpdate(() => {
      let currentTime = moment(this.manager.currentTime*1000).format("mm:ss")
      let currentWidth = this.manager.currentTime / this.manager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    });
    this.manager.onEnded(()=> {
      handelSwitch("next");
      this.setData({
        currentWidth : 0
      })
    });
  },
  // 修改音乐的播放状态
  changePlayState(isPlay){
    this.setData({
      isPlay
    });
    appInstance.globalData.isMusicPlay = isPlay;
  },

  // 点击播放或暂停的状态
  handelMusicPlay(){
    let {isPlay,musicId,url} = this.data;
    isPlay = !this.data.isPlay;
    this.musicControl(isPlay,musicId,url);
  },

  // 音乐播放，暂停
  async musicControl(isPlay,id,url){
    if(isPlay) {  // 播放
      if(!url) {
        let res = await request('song/url',{id : id});
        url = res.data[0].url;
        this.setData({
          url
        })
      }
      this.manager.src = url;
      this.manager.title = this.data.song.name;
    }else {   //暂停
      this.manager.pause();
    }
  },

  // 点击切歌的回调
  handelSwitch(e){
    // 切歌类型
    let type = e.currentTarget.id
    
    // 关闭当前音乐
    this.manager.stop();

    PubSub.subscribe("musicId",(msg,musicId) => {
      // 切歌自动播放
      this.getMusicInfo(musicId);
      this.musicControl(true,musicId)
      // 取消订阅
      PubSub.unsubscribe("musicId");
    });

    PubSub.publish("switchType",type);

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