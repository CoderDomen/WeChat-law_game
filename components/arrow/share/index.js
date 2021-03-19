import ImgRes from '../../../config/imgSrc';
import ArrowShare from '../../../palette/arrow-share';
import UserModel from '../../../model/userModel';
import ImgBev from '../../../behaviors/imgBev';

const BG = {
	BOY: ImgRes.ARROW_SHARE_BOY,
	GIRL: ImgRes.ARROW_SHARE_GIRL,
};

Component({
	behaviors: [ImgBev],
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		bgSrc: '',
		// 0 -> girl  1 -> boy
		// 绘图信息
		paintPallette: null,
	},

	attached() {
		const gameSex = UserModel.getGameSexInfo();
		const bgSrc = gameSex === 0 ? BG.GIRL : gameSex === 1 ? BG.BOY : '';
		this.setData({
			bgSrc: bgSrc,
		});
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// open-type的保存
		async onSave(e) {
			console.log(e);
			
			const { userInfo } = e.detail;
			if (!userInfo) {
				wx.showToast({
					title: '请先授权',
					icon: 'none',
					mask: true,
				});
			} else {
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
							// 游戏性别
							paintPallette: new ArrowShare(
								res.path,
								userInfo.nickName,
								UserModel.getGameSexInfo()
							).palette(),
						});
					},
				});
			}
			// this.triggerEvent('save');
		},
		// 关闭分享组件
		onClose() {
			this.triggerEvent('close');
		},

		// 分享
		onShare() {
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
					console.log(err);
					wx.hideLoading();
					if (err.errMsg.includes('fail auth deny')) {
						this.triggerEvent('saveErr');
					}
				},
			});
		},
	},
});
