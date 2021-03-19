import { SEXTYPE, GAME_RULE_ID } from '../../../config/config';
import ImgRes from '../../../config/imgSrc';
import ImgBev from '../../../behaviors/imgBev';
import CommonModel from '../../../model/commonModel';
const BannerBg = {
	boy: ImgRes.ARROW_ROLE_BOY,
	girl: ImgRes.ARROW_ROLE_GIRL,
};
Component({
	behaviors: [ImgBev],
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
    // 类型
    type: GAME_RULE_ID.ARROW,
		bgSrc: '',
		sex: 1,
		rule: `过学习法律只是，可以是自己的法律意识有所提高,能够领悟法律更深乘次的内涵，处理事情起来会更加理性，从而可以使大学生思想产生质的转变，做新一代的大学生，作为21世纪的中国建设者，通过学习这门课程，加强自我修养，依法规范自己的行为。`,
	},

	async created() {
    this._getGameRule();
  },

	attached() {
		this.setData({
			bgSrc: BannerBg.boy,
		});
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 改变性别
		handleGenderChange(e) {
			let { type: sexType } = e.currentTarget.dataset;
			sexType = parseInt(sexType);
			this.data.sex = sexType;
			this.setData({
				sex: sexType,
				bgSrc:
					sexType === SEXTYPE.BOY
						? BannerBg.boy
						: sexType === SEXTYPE.GIRL
						? BannerBg.girl
						: '',
			});
		},
		// 开始挑战
		startChallenge() {
			this.triggerEvent('start', {
				sex: this.data.sex,
			});
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
	},
});
