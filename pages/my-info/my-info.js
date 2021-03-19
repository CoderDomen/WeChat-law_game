import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { normalShareContent, ShareCore } from '../../utils/util';
import { PRO_BASE_URL } from '../../config/URI';

const um = new UserModel();

Page({
	isShare: false,
	behaviors: [navBev, ImgBev],
	data: {
		userInfo: null,
		elseInfo: null,
		nickName: '',
		mobile: '',
		address: '',
		baseurl:PRO_BASE_URL,
	},

	onLoad: function (options) {
		const userinfo = UserModel.getUserInfo();
		const elseInfo = Store.get('user');
		console.log(userinfo);
		console.log(elseInfo);
		const storage=wx.getStorageSync('storage');
		wx.request({
			url: this.data.baseurl+"/users/"+storage.uid,
			method: 'GET',
		
			success: (res) => {
				console.log(res.data.data.user_name);
				this.setData({
					nickName: res.data.data.user_name,
					mobile: res.data.data.user_mobile,
					address: res.data.data.address,
				});
				// console.log(mobile,address);

			},
		})
		this.setData({
			userInfo: userinfo,
			elseInfo: elseInfo,
		});

	},

	async onShow() {
		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.isShare = false;
		}
	},

	handleNickNameInput(e) {
		console.log(e);
		
		const { value } = e.detail;
		this.data.nickName = value;
	},

	handlePhoneInput(e) {
		const { value } = e.detail;
		this.data.mobile = value;
	},

	handleAddressInput(e) {
		const { value } = e.detail;
		this.data.address = value;
	},

	// 更新用户其他信息
	async handleSave() {
		wx.showLoading({
			title: '请稍等',
		});
		const userInfo = UserModel.getUserInfo();
		const elseInfo = Store.get('user');
		// let obj = Object.assign(userInfo, elseInfo, {
		// 	mobile: this.data.mobile,
		// 	address: this.data.address,
		// 	nickName: this.data.nickName,
		// 	userId: UserModel.hasUid(),
		// });
		console.log(this.data.mobile,this.data.address);
		const userid=wx.getStorageSync('uid');
		wx.request({
			url: this.data.baseurl+"/users",
			method: 'PUT',
			data:{
				address:this.data.address,
				mobile:this.data.mobile,
				userId:userid,
				nickName:this.data.nickName
			},
			success: (res) => {
				wx.showToast({
					title: '保存成功',
					duration: 2000,
					icon: 'none',
					mask: true,
					success: () => {
						setTimeout(() => {
							wx.navigateBack();
						}, 2000);
					},
				});
				
			},
		})
		// let updateRes = await um.updateInfo(obj);
		// if (updateRes.data.successed) {
			// wx.showToast({
			// 	title: '保存成功',
			// 	duration: 2000,
			// 	icon: 'none',
			// 	mask: true,
			// 	success: () => {
			// 		setTimeout(() => {
			// 			UserModel.updateCacheUser('address', this.data.address);
			// 			UserModel.updateCacheUser('mobile', this.data.mobile);
			// 			let userin = UserModel.getUserInfo();
			// 			userin.nickName = this.data.nickName;
			// 			UserModel.setUserInfo(userin);
			// 			wx.navigateBack();
			// 		}, 2000);
			// 	},
			// });
		// }
	},

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},
});
