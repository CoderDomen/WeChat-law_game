import navBev from '../../behaviors/behavior.js';
import ImgBev from '../../behaviors/imgBev';
import { ShareCore, normalShareContent } from '../../utils/util';
import Common from '../../model/commonModel';
import UserModel from '../../model/userModel';
import { LOCAL_IMAGES_SRC } from '../../config/imgSrc';
import { CDN_BASE_URL } from '../../config/URI';

Page({
	isShare: false,
	behaviors: [navBev, ImgBev],
	data: {
		// 排名
		rank: undefined,
		// 奖品标题
		title: undefined,
		// 本地图片
		LOCAL: LOCAL_IMAGES_SRC,
		// 是否获奖
		isGet: false,
		// 奖励图片
		price_img: undefined,
		//备注信息
		note:''
	},

	onLoad(options) {
		// 判断有无授权
		this.checkAuth();
		this._loadImgSrc();
		this._getAwardInfo();
	},

	async onShow() {
		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.isShare = false;
		}
	},

	checkAuth() {
		let userInfo = UserModel.getUserInfo();
		let auth = true;
		if (!userInfo.nickName) {
			// 没有授权
			auth = false;
		}
		this.setData({
			auth,
		});
	},

	// 填写收货地址
	handleAddress() {
		wx.navigateTo({
			url: '/pages/my-info/my-info',
		});
	},

	async handleUserInfo(e) {
		const userInfo = e.detail;

		// 上传信息
		const um = new UserModel();
		userInfo.userId = UserModel.hasUid();
		let res = await um.updateInfo(userInfo);
		if (res.data.successed) {
			Reflect.deleteProperty(userInfo, 'userId');
			UserModel.setUserInfo(userInfo);
			this._setTimeRecord();
			wx.navigateTo({
				url: '/pages/my-info/my-info',
			});
		} else {
			wx.showToast({
				title: '操作失败喔,请重试',
				icon: 'none',
			});
		}
	},

	// 设置记录时间
	_setTimeRecord() {
		// 七天
		let expire = 7 * 1000 * 3600 * 24;
		wx.setStorageSync('timestamp', +new Date() + expire);
	},

	handleIKnow() {
		wx.navigateBack();
	},

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},

	// 获取获奖信息
	async _getAwardInfo() {
		let common = new Common();
		let um = new UserModel();
		let [elseInfo, awardInfo] = await Promise.all([
			um.getElseInfo(),
			common.getAwardInfo(),
		]);
		console.log(elseInfo);
		
		console.log(awardInfo);
		
		const rank = elseInfo.rank;
		let isGet = false,
			title,
			note,
			price_img;
		awardInfo.data.forEach(da => {
			if (da.start_award <= rank && rank <= da.end_award) {
				isGet = true;
				price_img = CDN_BASE_URL + '/' + da.img;
				title = da.title;
				note = da.note;
				console.log("******"+da.start_award+"**"+rank+"**"+da.end_award);
			}
		});
		this.setData({
			rank,
			title,
			isGet,
			price_img,
			note
		});
	},
});
