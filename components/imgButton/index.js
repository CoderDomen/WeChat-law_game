Component({
  options: {
    multipleSlots: true 
  },
  properties: {
    openType: {
        type: String,
        value: 'getUserInfo'
    }
  },

  data: {

  },

  methods: {
    onGetUserInfo(event){
      if (!event.detail.userInfo) {
        return wx.showToast({
          title: '请先授权',
          icon: 'none'
        })
      }
      this.triggerEvent('getuserinfo', event.detail.userInfo);
      // this.triggerEvent('getuserinfo', event);
    }
  }
})
