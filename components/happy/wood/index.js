import ImgBev from '../../../behaviors/imgBev';
import UserModel from '../../../model/userModel';
import { Shield } from '../../../utils/assist';
import EV from '../../../class/event';

Component({
	behaviors: [ImgBev],
	properties: {},

	data: {
		mcsl: 0,
	},

	attached() {
		// 获取缓存
		this.update();
		EV.on('mcsl', this.update.bind(this));
	},

	methods: {
		update() {
			let mcsl = UserModel.getCacheUser('mcsl');
			this.setData({
				mcsl,
			});
		},

		// 获取木材（去答题）
		handleGet() {
			if (Shield() <= 0) {
				return wx.showToast({
					title: '护盾已用完',
					icon: 'none',
				});
			}
			wx.navigateTo({
				url: '/pages/happy-answer/happy-answer',
			});
		},
	},
});
