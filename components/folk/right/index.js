// components/fright/right/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: Boolean,
    next: Number
  },

  observers: {
    next() {
      this.clearAnimation('#right');
    },
    hidden(val) {
      if (!val) {
        this.animate(
          '#right',
          [
            { opacity: 0, scale: [0], offset: 0 },
            { opacity: 1, scale: [1.2], offset: 0.7 },
            { opacity: 1, scale: [1], offset: 1 },
          ],
          300,
          // () => {
          //   this.clearAnimation('#right');
          // }
        )
      } else {
        this.clearAnimation('#right');
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
