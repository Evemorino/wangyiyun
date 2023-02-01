import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //视频导航组
    navId: "", //视频组id
    videoList: [], //视频列表数据
    videoId: "", //视频id标识
    videoUpdateTime: [], //视频播放时长
    isTriggered: false, //下拉刷新标记
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航组
    this.getVideoGroupList();

  },
  // 获取导航组
  async getVideoGroupList() {
    let videoGroupListData = await request('video/group/list', {});
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    // 获取视频列表
    this.getVideoList(this.data.navId);
  },
  // 点击改变导航组id
  changeNav(event) {
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId >>> 0,
      videoList: []
    });

    // 显示正在加载
    wx.showLoading({
      title: '正在加载',
    })

    // 动态获取当前导航对应的视频列表
    this.getVideoList(this.data.navId);
  },
  // 获取视频列表
  async getVideoList(id) {
    if (!id) {
      return;
    }
    let res = await request("video/group", {
      id
    });
    // 关闭消息提示框
    wx.hideLoading();
    let index = 0;
    let videoList = []

    if (res.code == 200) {
      videoList = res.datas.map(item => {
        item.id = index++;
        return item;
      });
    }
    this.setData({
      videoList,
      // 关闭下拉刷新
      isTriggered: false
    })

  },

  // 点击播放，继续播放的回调 
  handelPlay(e) {
    // 当前的视频id
    let vid = e.currentTarget.id;
    /*
        // 关掉上一个视频
        this.vid !== vid && this.videoContext && this.videoContext.stop();
        this.vid = vid;
    */

    // 更新data中的videoId
    this.setData({
      videoId: vid
    })

    // 创建实例
    this.videoContext = wx.createVideoContext(vid);
    // 判断当前视频是否有播放记录
    let {
      videoUpdateTime
    } = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    } else {
      this.videoContext.play();
    }

  },

  // 监听视频播放进度的回调
  handelTimeUpdate(e) {
    let videObject = {
      vid: e.currentTarget.id,
      currentTime: e.detail.currentTime
    }
    // 判断当前播放记录是否存在
    let {
      videoUpdateTime
    } = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === videObject.vid)
    if (videoItem) {
      videoItem.currentTime = e.detail.currentTime;
    } else {
      videoUpdateTime.push(videObject);
    }
    this.setData({
      videoUpdateTime
    })
  },

  // 视频播放结束调用
  heandelEnded(e) {
    let {
      videoUpdateTime
    } = this.data;
    let index = videoUpdateTime.findIndex(item => item.vid === e.currentTarget.id);
    videoUpdateTime.splice(index, 1);
    this.setData({
      videoUpdateTime
    })
  },

  // 自定义下拉刷新的回调
  handelRefresh() {
    // console.log("下拉刷新")
    this.getVideoList(this.data.navId);
  },

  // 自定义上拉加载
  handelToLower() {
    // 模拟加载
    let newVideoList = this.data.videoList;
    let videoList = this.data.videoList;
    videoList.push(...newVideoList);
    this.setData({
      videoList
    })
  },

  // 跳转至搜索页面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
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
    // console.log("页面下拉")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log("页面上拉")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({
    from
  }) {
    if ("button" == from) {
      return {
        title: "button转发内容",
        page: "/pages/video/video",
        imageUrl: "/static/images/nvsheng.jpg"
      }
    } else {
      return {
        title: "menu转发内容",
        page: "/pages/video/video",
        imageUrl: "/static/images/nvsheng.jpg"
      }
    }
  }
})