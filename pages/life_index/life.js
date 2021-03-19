import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import { IDENTIFY, GAME_MODE } from '../../config/config';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { ShareCore, normalShareContent } from '../../utils/util';

Page({
	isShare: false,
	behaviors: [navBev, ImgBev],
	data: {
		myVar:''
	},

	onLoad() {
    this._loadImgSrc();
    this.data.myVar = setTimeout(function () {
      
      wx.reLaunch({
      url: '/pages/life-home/life-home',
      })
      Store.set('life-home', 1)
    }, 2000);
	},
	onUnload () {
		clearTimeout(this.data.myVar);
	 },
	onHide(){
		clearTimeout(this.data.myVar);
	},
	
	setTimeout(){
		setTimeout(function () {
      
      wx.reLaunch({
      url: '/pages/life-home/life-home',
      })
      Store.set('life-home', 1)
    }, 2000);
	},
	frightRandom() {
		let elseInfo = Store.get('user');
		if (elseInfo.shield <= 0) {
			return wx.showToast({
				title: '护盾已用完',
				icon: 'none',
			});
		} else {
			wx.navigateTo({
				url: `/pages/folk-fright/folk-fright?type=${GAME_MODE.RANDOM}`,
			});
		}
	},

	// 处理用户信息
	async handleUserInfo(e) {
		// 更新信息后，存储一个标识在缓存中
		let { userInfo } = e.detail;
		if (userInfo) {
			let elseInfo = Store.get('user');
			if (elseInfo.shield === 0) {
				return wx.showToast({
					title: '护盾已用完',
					icon: 'none',
				});
			}
			const um = new UserModel();
			userInfo.userId = UserModel.hasUid();
			let updateRes = await um.updateInfo(userInfo);
			if (updateRes.data.successed) {
				UserModel.setUserInfo(userInfo);
				this.frightWithFriend();
			} else {
				wx.showToast({
					title: '操作失败,请稍后重试',
					icon: 'none',
				});
			}
		} else {
			wx.showToast({
				title: '请先授权',
				icon: 'none',
			});
		}
	},

	async onShow() {
		let msg = Store.get('error');
		if (msg) {
			wx.showToast({
				title: msg,
				icon: 'none',
				mask: true,
				complete() {
					Store.set('error', null);
				},
			});
		}

		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.isShare = false;
		}
	},

	frightWithFriend() {
		wx.navigateTo({
			url: `/pages/folk-fright/folk-fright?type=${GAME_MODE.FRIEND}&status=${IDENTIFY.SELF}`,
		});
	},

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},
});
