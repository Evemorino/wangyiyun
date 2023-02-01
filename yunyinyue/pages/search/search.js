import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // placeholder默认内容
    placeholder :"" , 
    // 热搜榜列表
    hostList : [] , 
    // input的内容
    searchContent : "" ,
    // 搜索结果
    searchList : [] , 
    // 搜索历史记录
    historyList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    // 函数节流使用
    this.isSend = false;
    this.getSearchHistory();
  },
  // 获取原始数据
  async getInitData(){
    let placeholderData = await request('search/default');
    let placeholder = placeholderData.data.showKeyword;
    let hostListData = await request('search/hot/detail');
    let hostList = hostListData.data;
    this.setData({
      placeholder,
      hostList
    });
  },

  // 处理input变化的回调
  handelInputChange(e){
    let searchContentData = e.detail.value;
    let searchContent = searchContentData.trim();
    this.setData({
      searchContent
    });
    // input框内容为空
    if('' == searchContent) {
      this.setData({
        searchList : []
      })
      return ;
    };
    
    if(this.isSend){
      return ;
    }
    this.isSend = true;
    this.getSearchList();
    setTimeout(() => {
      this.isSend = false;
    },300);
    
  },

  // 获取搜索数据的功能函数
  async getSearchList(){
    let {searchContent , historyList} = this.data;
    let searchListData = await request('search',{keywords:searchContent,limit:10});
    let searchList = searchListData.result.songs;
    this.setData({
      searchList
    })
    // 添加搜索历史记录
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1);
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    wx.setStorageSync('historyList', historyList)
  },

  // 获取本地历史记录
  getSearchHistory(){
    let historyList = wx.getStorageSync("historyList");
    if(historyList) {
      this.setData({
        historyList
      })
    }
  },

  // 清空搜索内容
  clearSearchContent(){
    this.setData({
      searchContent : ""
    })
  },

  // 清空搜索历史记录
  deleteSearchHistory(){
    wx.showModal({
      content : "确定删除历史记录吗？",
      success : (e) => {
        if(e.confirm) {
          wx.removeStorageSync('historyList');
          this.setData({
            historyList : []
          })
        }
      },
      cancelColor: 'cancelColor',
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