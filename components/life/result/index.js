import ImgRes from '../../../config/imgSrc';
import UserModel from '../../../model/userModel';
import ImgBev from '../../../behaviors/imgBev';

const BGSRC = {
	WIN: ImgRes.ARROW_RESULT_WIN,
	LOSE: ImgRes.ARROW_RESULT_LOSE,
};

const AVATARSRC = {
	BOY: ImgRes.ARROW_RESULT_FAIL_BOY,
	GIRL: ImgRes.ARROW_RESULT_FAIL_GIRL,
};

Component({

	behaviors: [ImgBev],
	properties: {
		hidden: Boolean,
		// 0 -> 闯关成功, 1 -> 闯关失败（男）, 2 —> 闯关失败（女）
		resultType: {
			type: Number,
			value: 0,
		},
		// 答对题目的数目，只有 resultType = 0 的时候才生效, 目前算每一题2分的制度
		count: Number,
		// 奖励金币的数量
		coin: Number
	},

	data: {
		bgSrc: '',
		avatarSrc: '',
	},

	attached() {
		if (this.properties.resultType === 0) {
			this.setData({
				bgSrc: BGSRC.WIN,
			});
		} else {
			this.setData({
				bgSrc: BGSRC.LOSE,
			});
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onBack() {
			this.triggerEvent('back');
		},
		onContinue() {
			this.triggerEvent('continue');
		},
		onShare() {
			this.triggerEvent('share');
		},
	},
});
