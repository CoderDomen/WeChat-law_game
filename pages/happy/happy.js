import navBev from '../../behaviors/behavior';
import { ShareCore, normalShareContent } from '../../utils/util';
import ImgRes from '../../config/imgSrc';
import Store from '../../model/storeModel';

const pageBg = {
	INTRO: ImgRes.ARROW_ROLE_BG,
	GAME: ImgRes.SUNNY_GAME_BG,
};

const MODE = {
	// 游戏介绍模式
	INTRO: 0,
	// 游戏中模式
	GAME: 1,
};

Page({
	isShare: false,
	behaviors: [navBev],
	data: {
		// 显示组件类型
		game_type: null,
	},

	onLoad() {
		this.setData({
			game_type: MODE.INTRO,
		});
		this._setBg();
	},

	async onShow() {
		// 暂时  后续需要修改
		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.isShare = false;
		}
		// 检查错误
		let error = Store.get('happy_error');
		if (error) {
			wx.showToast({
				title: error,
				icon: 'none',
				success: () => {
					Store.remove('happy_error');
				},
			});
		}
	},
	// 开始挑战
	handleStart() {
		wx.redirectTo({
			url: '/pages/happy-home/happy-home'
		})
		Store.set('happy_intro', 1);
	},
	onShareAppMessage() {
		this.isShare = true;
		return normalShareContent();
	},

	// 根据场景类型选择背景
	_setBg() {
		const { game_type } = this.data;
		const bg_img = game_type === MODE.INTRO ? pageBg.INTRO : pageBg.GAME;
		this.setData({
			pageBg: bg_img,
		});
	},
});
