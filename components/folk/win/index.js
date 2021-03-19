import ImgBev from '../../../behaviors/imgBev';

Component({
  behaviors: [ImgBev],
  /**
   * 组件的属性列表
   */
  properties: {
    myScore: Number,
    enemyScore: Number,
    enemyAvatar: String,
    coin: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached() {
    this._loadImgSrc();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBack() {
      this.triggerEvent('back');
    },
    onShareResult() {
      this.triggerEvent('share');
    },
    onContinue() {
      this.triggerEvent('continue');
    }
  }
})
