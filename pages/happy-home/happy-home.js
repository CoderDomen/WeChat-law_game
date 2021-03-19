import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import Common from '../../model/commonModel';
import {
	CAT
} from '../../config/config';
import Store from '../../model/storeModel';
import UserModel from '../../model/userModel';
import {
	normalShareContent,
	ShareCore
} from '../../utils/util';

let common = new Common();

Page({
	isShare: false,
	isFirst: true,
	behaviors: [navBev, ImgBev],
	data: {
		catid: CAT.HAPPINESS,
		// 关闭音乐实例
		musicDestory: false,
		itemList: [],
		templist: [],
		imgList: [],
	},

	onLoad: async function (options) {
		this._getMyBuild(() => {
			this.isFirst = false;
		});
		this._getImgSrc();
	},

	async onShow() {
		this._checkError();
		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.setData({
				user: Store.get('user'),
			});
			this.isShare = false;
		}
		// 获取我的建筑
		if (!this.isFirst) {
			wx.showLoading();
			await this._getMyBuild();
			wx.hideLoading();
		}
	},

	onUnload: function () {
		this._destoryMusic();
	},

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},
	handleLoadSuc() {
		this.setData({
			itemList: this.data.templist,
		});
		wx.hideLoading();
	},
	// 进入二级建筑区域
	handleDetail(e) {
		const {
			id,
			label
		} = e.target.dataset;
		if (id) {
			wx.navigateTo({
				url: `/pages/happy-detail/happy-detail?id=${id}&title=${label}`,
			});
		}
	},

	// 导航栏返回
	handleNavBack() {
		wx.navigateBack({
		delta: 2,
		});
		// wx.reLaunch()({
		// 	url: '/pages/home/home',

		// });
		this.setData({
			musicDestory: true,
		});
	},

	// 我的社区
	handle2My() {
		wx.navigateTo({
			url: '/pages/happy-my/happy-my',
		});
	},

	// 获取图片资源
	async _getImgSrc() {
		wx.showLoading({
			mask: true,
		});
		let {
			data
		} = await common.getHappyHomeImg();
		this.setData({
			templist: data.data,
			imgList: data.data.map(item => {
				return item.imgSrc;
			}),
		});
	},

	// 摧毁 bgm 实例
	_destoryMusic() {
		this.setData({
			musicDestory: true,
		});
	},

	_checkError() {
		let error = Store.get('happy_error');
		if (error) {
			wx.showToast({
				title: error,
				icon: 'none',
			});
			Store.remove('happy_error');
		}
	},

	// 获取我已解锁的建筑
	async _getMyBuild(fn) {
		let myBuild = await common.getMyBuild(UserModel.hasUid());
		let itemList = [];
		if (myBuild.data && myBuild.data.length) {
			itemList = myBuild.data.map(item => {
				console.log(1);
				return {
					id: item.build_id,
					label: item.title,
					imgSrc: item.img || '',
					pid: item.pid,
				};
			});
		}
		Store.set('mybuild', itemList);
		fn && fn();
	},
});