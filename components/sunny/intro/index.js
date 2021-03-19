import ImgBev from '../../../behaviors/imgBev';
import { GAME_RULE_ID } from '../../../config/config';
import CommonModel from '../../../model/commonModel';

Component({
  behaviors: [ImgBev],
  properties: {

  },

  data: {
    type: GAME_RULE_ID.SUNNY,
    rule: '过学习法律只是，可以是自己的法律意识有所提高,能够领悟法律更深乘次的内涵，处理事情起来会更加理性，从而可以使大学生思想产生质的转变，做新一代的大学生，作为21世纪的中国建设者，通过学习这门课程，加强自我修养，依法规范自己的行为。'
  },

  created() {
    this._getGameRule();
  },

  methods: {
    hanleChallenge() {
      this.triggerEvent('start');
    },
    // 获取游戏玩法
		async _getGameRule() {
			let ruleRes = await new CommonModel().getGameRule(this.data.type);
			if (!ruleRes) {
				wx.showToast({
					title: '发生错误',
					icon: 'none',
				});
			} else {
				this.setData({
					rule: ruleRes,
				});
			}
		},
  }
})
