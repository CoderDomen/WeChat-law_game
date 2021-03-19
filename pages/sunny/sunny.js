import ImgRes from '../../config/imgSrc';
import navBev from '../../behaviors/behavior';
import Store from '../../model/storeModel';
import { AUTH_FAIL, CAT } from '../../config/config';
import { ShareCore, normalShareContent } from '../../utils/util';
import { Shield } from '../../utils/assist';
import Common from '../../model/commonModel';
import UserModel from '../../model/userModel';
import EV from '../../class/event';

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
	// 计时器
	timeDown: null,
	// 去挑战
	go: false,
	tapShare: false,
	isShare: false,
	first: false,

	behaviors: [navBev],
	data: {
		// 游戏模块
		catid: CAT.SUN,
		// 显示组件类型
		game_type: null,
		// 页面背景
		pageBg: '',
		// 是否有弹出层
		pop: false,
		// 闯关种类是否上锁
		lock: false,
		// 开启倒计时的对象
		acType: null,
		// 控制倒计时的定时器
		stop: false,
		// 控制tips和下一题按钮的锁
		showFlag: false,
		// 弹框锁
		modal: false,
		// 摧毁音乐实例
		musicDestory: false,
		// 生长状态 及 配置
		progress: undefined,
		// 树生长情况
		tree_status: -1,
	},

	onLoad() {
		// 获取进度
		this._getProgress();
		// 检查是否展示介绍页
		this._checkIntro();
		this._setBg();
		// 检查是否有倒计时
		// this._checkDownTime();
		EV.on('time_down', () => {
			this._checkDownTime();
		});
		this.first = true;
	},

	onUnload() {
		// 停止计时器
		this._stopTimer();
		// 摧毁 bmg
		this._destoryMusic();
	},
	onHide() {
		// 停止计时器
		this._stopTimer();
	},
	async onShow() {
		this._checkDownTime();
		if (this.go) {
			this._getProgress();
		}

		if (this.isShare) {
			let type = 0;
			if (this.tapShare) {
				type = 1;
			}
			await ShareCore.call(this, type);
			this.isShare = false;
			this.tapShare = false;
		}

		// 检查错误
		let error = Store.get('sunny_error');
		if (error) {
			wx.showToast({
				title: error,
				icon: 'none',
				success: () => {
					Store.remove('sunny_error');
				},
			});
		}
	},

	onShareAppMessage() {
		this.isShare = true;
		return normalShareContent();
	},

	// 监听海报错误事件
	handleShareErr(e) {
		console.log(e);
		wx.hideLoading();
		const { msg } = e.detail;
		if (msg === AUTH_FAIL.PHOTO) {
			this.setData({
				modal: true,
			});
		}
	},

	// modal关闭设置的回调
	handleComfirm() {
		this.setData({
			modal: false,
		});
	},

	handleShareTap() {
		this.tapShare = true;
	},

	// 答题
	async handleQue(e) {
		if (Shield() <= 0) {
			return wx.showToast({
				title: '护盾已用完',
				icon: 'none',
			});
		}
		console.log(e);
		
		const { type, pro,total } = e.detail;
		this.go = true;
		if (type && pro && total) {		
			wx.navigateTo({
				url: `/pages/sunny-answer/sunny-answer?type=${type}&pro=${pro}&total=${total}`,
			});
		}
	},
	// 开始挑战
	handleStart() {
		this.setData({
			game_type: MODE.GAME,
		});
		Store.set('sunny_intro', 1);
		this._setBg();
	},

	// 分享处理
	handleShare() {
		this.setData({
			pop: true,
		});
	},
	// 关闭分享
	handleClose() {
		this.setData({
			pop: false,
		});
	},
	// 监听 game 重新拉去进度
	handleGameFetch() {
		this._getProgress();
	},
	// 摧毁 bgm 实例
	_destoryMusic() {
		this.setData({
			musicDestory: true,
		});
	},

	// 停止计时器
	_stopTimer() {
		this.setData({
			stop: true,
		});
	},

	// 判断是否展示介绍页
	_checkIntro() {
		let intro = Store.get('sunny_intro');
		if (intro) {
			this.setData({
				game_type: MODE.GAME,
			});
		} else {
			this.setData({
				game_type: MODE.INTRO,
			});
		}
	},


	// 导航栏返回
	handleNavBack() {
		wx.navigateBack({
			delta: 2,
			});
		// wx.navigateTo({
		// 	url: '/pages/home/home',

		// });
	},


	// 根据场景类型选择背景
	_setBg() {
		const { game_type } = this.data;
		const bg_img = game_type === MODE.INTRO ? pageBg.INTRO : pageBg.GAME;
		this.setData({
			pageBg: bg_img,
		});
	},
	// 检查倒计时
	_checkDownTime() {
		let sunny_down = Store.get('sunny_down');
		if (sunny_down && sunny_down.types.length > 0) {
			let arr = sunny_down.types.slice();
			// 过期的时间，从数组中删除
			arr.forEach((type, index) => {
				if (Date.now() > sunny_down[type]) {
					Reflect.deleteProperty(sunny_down, type);
					let idx = sunny_down.types.findIndex(val => val === type);
					sunny_down.types.splice(idx, 1);
				}
			})
			console.log(sunny_down);
			// 删除对象属性，删除数组元素
			Store.set('sunny_down', sunny_down);
			this.setData({
				lock: true,
				acType: sunny_down,
			});
		} else if (sunny_down && sunny_down.types.length === 0) {
			Store.remove('sunny_down');
		}
	},

	// 获取进度
	async _getProgress() {
		let common = new Common();
		let { data } = await common.getTreeStatus(UserModel.hasUid());
		if (data.successed) {
			let progress = [];
			Object.keys(data.config).forEach(key => {
				let ob = {
					type: key,
					config: data.config[key],
					user_pro: data.user[key],
				};
				progress.push(ob);
			});

			this.setData({
				progress,
				tree_status: data.user.tree_stage,
			});
		} else {
			if (data.need_bozhong) {
				this.setData({
					tree_status: 0,
				});
				return;
			}
			wx.showToast({
				title: '发生错误',
				icon: 'none',
			});
		}
	},
});
