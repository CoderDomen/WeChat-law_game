import ImgBev from '../../../behaviors/imgBev';
import { SUNNY_MAP, SUNNY_SOFT_TYPE } from '../../../config/config';

Component({
  
  behaviors: [ImgBev],
  properties: {
    // 种类
    kind: String,
    // 成功还是失败
    type: String,
    // 浇水，肥料，除草，太阳
    soft: Number,
  },

  observers: {
    soft(val) {
      if(val) {
        let su = SUNNY_MAP.get(this.properties.soft);
        this.setData({
          sunny: su
        })
      }
    }
  },

  data: {
    sunny: null
  },

  attached() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭
    onClose() {
      this.triggerEvent('close')
    },
    // 继续
    onContinue() {
      this.triggerEvent('continue')
    }
  }
})
