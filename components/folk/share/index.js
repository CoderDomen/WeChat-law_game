import ImgBev from '../../../behaviors/imgBev';
import FolkShare from '../../../palette/folk-share';
import UserModel from '../../../model/userModel';

Component({
	behaviors: [ImgBev],
	/**
	 * 组件的属性列表
	 */
	properties: {
		score: Number,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		// 画图信息
		paintPallette: '',
	},

	attached() {
		this._loadImgSrc();
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 保存图片
		async handleSaveImage(e) {
			const { userInfo } = e.detail;
			if (!userInfo) {
				return wx.showToast({
					title: '请先授权',
					icon: 'none',
					mask: true,
				});
			}
			let uInfo = UserModel.getUserInfo();
			// 根据缓存中有无用户信息来判断是否上传用户信息
			if(!uInfo) {
				userInfo.userId = UserModel.hasUid();
				let res = await new UserModel().updateInfo(userInfo);
				if(res.data.successed) {
					Reflect.deleteProperty(userInfo, 'userId');
					UserModel.setUserInfo(userInfo);
				}
			}
			wx.showLoading({ title: '正在保存中' });
			wx.getImageInfo({
				src: userInfo.avatarUrl,
				success: res => {
					this.setData({
						paintPallette: new FolkShare(
							res.path,
							this.properties.score
						).palette(),
					});
				},
				fail: err => {
					wx.hideLoading();
					if (
						err.errMsg.includes('fail auth deny') ||
						err.errMsg.includes('fail authorize no response')
					) {
						this.triggerEvent('saveErr');
					}
				}
			});
		},

		// 转发好友
		onshare() {
			this.triggerEvent('share');
		},

		// painter绘图完毕
		onImgOK(e) {
			const imagePath = e.detail.path;
			wx.saveImageToPhotosAlbum({
				filePath: imagePath,
				success: () => {
					wx.showToast({
						title: '图片保存成功',
					});
				},
				fail: err => {
					wx.hideLoading();
					if (
						err.errMsg.includes('fail auth deny') ||
						err.errMsg.includes('fail authorize no response')
					) {
						this.triggerEvent('saveErr');
					}
				},
			});
		},
		// painter绘图失败
		onImgErr(e) {
			wx.showToast({
				title: e,
				icon: 'none',
			});
		},
	},
});
