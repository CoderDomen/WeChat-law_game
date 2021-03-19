import ImgBev from '../../../behaviors/imgBev';
import SunnyShare from '../../../palette/sunny-share';
import { AUTH_FAIL } from '../../../config/config';

Component({
	behaviors: [ImgBev],
	properties: {},

	data: {
		paintPallette: null,
	},

	methods: {
		onSave(e) {
			const { userInfo } = e.detail;
			if (!userInfo) {
				wx.showToast({
					title: '请先授权',
					icon: 'none',
					mask: true,
				});
			} else {
				wx.showLoading({ title: '正在保存中' });
				console.log(userInfo.nickName);
				wx.getImageInfo({
					src: userInfo.avatarUrl,
					success: res => {
						this.setData({
							// 游戏性别
							paintPallette: new SunnyShare(
								res.path,
								userInfo.nickName
							).palette(),
						});
					},
					fail: err => {
						wx.hideLoading();
						if (
							err.errMsg.includes('fail auth deny') ||
							err.errMsg.includes('fail authorize no response')
						) {
							this.triggerEvent('err', {
								msg: AUTH_FAIL.PHOTO,
							});
						}
					},
				});
			}
		},

		// painter绘图完毕
		onImgOK(e) {
			const imagePath = e.detail.path;
			wx.saveImageToPhotosAlbum({
				filePath: imagePath,
				success: () => {
					// wx.hideLoading();
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
						this.triggerEvent('err', {
							msg: AUTH_FAIL.PHOTO,
						});
					}
				},
			});
		},

		onShare() {
			this.triggerEvent('share');
		},

		// 关闭分享
		onClose() {
			this.triggerEvent('close');
		},
	},
});
