import { GAME_MODE, IDENTIFY } from '../../config/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  onInput(e) {
    this.data.room_id = e.detail.value;
  },

  // 加入房间
  onJoinRoom() {
    const roomid = this.data.room_id;
    const avatarUrl = '';
    const nickName = '测试';
    const path = `/pages/index/index?type=${GAME_MODE.FRIEND}&status=${IDENTIFY.FRIEND}&room_id=${roomid}&avatarUrl=${avatarUrl}&nickName=${nickName}`;
    wx.navigateTo({
      url: path
    })
  }
})


// 轮询接口增加字段qaNum
// 上传结果增加queNum