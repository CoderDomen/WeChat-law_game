import ImgBev from '../../../behaviors/imgBev';
import HappyShare from '../../../palette/happy-share';
import { AUTH_FAIL } from '../../../config/config';

Component({
	behaviors: [ImgBev],
	properties: {
		save: Boolean,
		uinfo: {
			type: Object,
			value: null,
		},
	},

	data: {
		paintPallette: null,
		lock: false
	},

	observers: {
		save(val) {
			if (val && this.properties.uinfo) {
				const userInfo = this.properties.uinfo;
				wx.getImageInfo({
					src: userInfo.avatarUrl,
					success: res => {
						this.setData({
							// 游戏性别
							paintPallette: new HappyShare(
								res.path,
								userInfo.nickName
							).palette(),
						});
						
					
					},
					fail: err => {
						if (
							err.errMsg.includes('fail auth deny') ||
							err.errMsg.includes('fail authorize no response')
						) {
							// 没有授权保存图片
							this.triggerEvent('err', {
								msg: AUTH_FAIL.PHOTO,
							});
						}
					},
				});
			}
		},
	},

	methods: {
		onSave(e) {
			if(this.data.lock) {
				return;
			}
			const { userInfo } = e.detail;
			if (!userInfo) {
				wx.showToast({
					title: '请先授权',
					icon: 'none',
					mask: true,
				});
			} else {
				wx.showLoading({ title: '正在保存中' });
				this.data.lock = true;
				console.log(userInfo.nickName);
				wx.getImageInfo({
					src: userInfo.avatarUrl,
					success: res => {
						this.setData({
							// 游戏性别
							paintPallette: new HappyShare(
								res.path,
								userInfo.nickName
							).palette(),
						});
					},
				});
				
			}
		},

		onShare() {
			this.triggerEvent('share');
		},

		// painter绘图完毕
		onImgOK(e) {
			const imagePath = e.detail.path;
			console.log(e);
			
			wx.saveImageToPhotosAlbum({
				filePath: imagePath,
				success: () => {
					// wx.hideLoading();
					wx.showToast({
						title: '图片保存成功',
					});
					setTimeout(wx.redirectTo({
						url: '/pages/happy-my/happy-my',
			
					}),1000);
					
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

		// 关闭分享
		onClose() {
			this.triggerEvent('close');
		},
	},
});
