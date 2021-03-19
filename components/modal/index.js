Component({
  properties: {
    title: {
      type: String,
      value: '无法保存图片到相册'
    },
    content: {
      type: String,
      value: '点击「确定」,去设置勾选相册权限'
    }
  },

  data: {

  },

  methods: {
    handleOpensetting(e) {
      this.triggerEvent('openSetting');
    }
  }
})
