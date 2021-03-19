import ImgBev from '../../../behaviors/imgBev';
import ImgSrc from '../../../config/imgSrc';

const TYPE = {
  SUCCESS: {
    imgsrc: ImgSrc.HAPPY_ICON_WOOD_SUCCESS,
    title: '获得木材1根',
    tips: '您的社区又多了一块砖'
  },
  FAIL: {
    imgsrc: ImgSrc.HAPPY_ICON_WOOD_FAIL,
    title: '很遗憾, 获取失败!',
    tips: '请继续努力搬砖吧 !'
  }
}

Component({
  behaviors: [ImgBev],
  properties: {
    type: String
  },

  observers: {
    type(val) {
      if(val) {
        const type = TYPE[val.toUpperCase()];
        this.setData({
          imgSrc: type.imgsrc,
          title: type.title,
          tips: type.tips
        })
      }
    }
  },

  data: {
    imgSrc: '',
    title: '',
    tips: '',
  },

  attached() {
  },

  methods: {
    // 关闭
    onClose() {
      this.triggerEvent('close');
    },
    // 继续挑战
    onContinue() {
      this.triggerEvent('continue');
    }
  }
})
