import navBev from '../../behaviors/behavior.js';
import ImgBev from '../../behaviors/imgBev';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { LOCAL_IMAGES_SRC } from '../../config/imgSrc';
import { normalShareContent, ShareCore } from '../../utils/util';
import { PRO_BASE_URL } from '../../config/URI';
const um = new UserModel();

Page({
	firstFlag: true,
	isShare: false,
	behaviors: [navBev, ImgBev],
	data: {
		local: LOCAL_IMAGES_SRC,
		rankList: [],
		// 用户信息
		userInfo: null,
		// 用户的其他信息
		user: null,
		// 阅读次数
		readNum: 0,
		// 体验次数
		expNum: 0,
		// 通关次数
		passNum: 0,
		baseurl:PRO_BASE_URL,
	},

	async onLoad(options) {
		const storage=wx.getStorageSync('storage');
		wx.request({
			url: this.data.baseurl+"/users/"+storage.uid,
			method: 'GET',
		
			success: (res) => {
				console.log(res.data.data.user_name);
				this.setData({
					nickName: res.data.data.user_name,
				});
			},
		})
		await this._updateInfo();
		
	},

	async onShow() {
		const storage=wx.getStorageSync('storage');
		wx.request({
			url: this.data.baseurl+"/users/"+storage.uid,
			method: 'GET',
		
			success: (res) => {
				console.log(res.data.data.user_name);
				this.setData({
					nickName: res.data.data.user_name,
				});
			},
		});
		if(!this.firstFlag) {
			this._updateInfo();
		}
		if(this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.setData({
				user: Store.get('user')
			})
			this.isShare = false;
		}
	},

	onShareAppMessage() {
		this.isShare = true;
		return normalShareContent();
	},

	// 更新用户信息
	async _updateInfo() {
		let userInfo = UserModel.getUserInfo();
		if (userInfo && userInfo.avatarUrl) {
			this.setData({
				userInfo,
				user: Store.get('user'),
				// nickName:userInfo.nickName,
			})
		}
		wx.showLoading();
		let elInfo = await um.getElseInfo();
		if(elInfo.successed) {
			elInfo.coinRank.sort((x, y) => {
				x.user_image = x.user_image.includes('https') ? x.user_image : this.data.ImgRes.HOME_AVATAR;
				y.user_image = y.user_image.includes('https') ? y.user_image : this.data.ImgRes.HOME_AVATAR;
				return y.coin - x.coin;
			});
			this.setData({
				readNum: null,
				expNum: elInfo.qa_count,
				passNum: elInfo.pass_count,
				rankList: elInfo.coinRank,
				readNum: elInfo.video_count
			});
			this.firstFlag = false;
		} else {
			wx.showToast({
				title: '获取数据失败',
				icon: 'none'
			})
		}
		wx.hideLoading();
	}
});
