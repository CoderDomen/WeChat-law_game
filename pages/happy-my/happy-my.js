import NavBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import ImgSrc from '../../config/imgSrc';
import { AUTH_FAIL, CAT } from '../../config/config';
import UserModel from '../../model/userModel';
import Common from '../../model/commonModel';
import Store from '../../model/storeModel';
import { normalShareContent, ShareCore } from '../../utils/util';

let common = new Common();

// {
// 	id: 1,
// 	label: '商业区',
// 	imgSrc: ImgSrc.HAPPY_PLACE_BUSINESS,
// },
// {
// 	id: 2,
// 	label: '生活区',
// 	imgSrc: ImgSrc.HAPPY_PLACE_LIVE,
// },
// {
// 	id: 3,
// 	label: '服务设施',
// 	imgSrc: ImgSrc.HAPPY_PLACE_SERVICE,
// },
// {
// 	id: 4,
// 	label: '学校',
// 	imgSrc: ImgSrc.HAPPY_PLACE_SCHOOL,
// },
// {
// 	id: 5,
// 	label: '休闲区',
// 	imgSrc: ImgSrc.HAPPY_PLACE_REST,
// },
// {
// 	id: 6,
// 	label: '交通设施',
// 	imgSrc: ImgSrc.HAPPY_PLACE_TRAFFIC,
// },

Page({
	tapShare: false,
	isShare: false,
	behaviors: [NavBev, ImgBev],
	data: {
		share: false,
		// 海报保存锁
		savePaint: false,
		// 弹出锁
		modal: false,
		// 用户信息
		uInfo: null,
		// 游戏类型
		catid: CAT.HAPPINESS,
		itemList: [],
		// 预加载图片
		imgList: [],
		// 临时图片
		tempList: undefined
	},

	async onLoad(options) {
		this._searchMyBuild();
	},

	async onShow() {
		this._checkError();
		if(this.isShare) {
			let type = 0;
			if(this.tapShare) {
				type = 1;
			}
			await ShareCore.call(this, type);
			this.isShare = false;
			this.tapShare = false;
		}
	},

	onUnload() {},
	// 直接保存海报
	handlePaintSave(e) {
		if (this.data.savePaint) {
			return;
		}
		console.log(e.detail);
		// const { errMsg, userInfo } = e.detail;
		const userInfo = e.detail;
		const errMsg = e.detail;
		// console.log(errMsg);
		console.log(userInfo);
		// if (
		// 	errMsg.includes('fail auth deny') ||
		// 	errMsg.includes('fail authorize no response')
		// ) {
		// 	return wx.Toast({
		// 		title: '请先授权噢',
		// 		icon: 'none',
		// 	});
		// }
		if (userInfo) {
			wx.showLoading({
				title: '正在保存中',
				mask: true,
			});
			// 更新缓存
			UserModel.setUserInfo(userInfo);
			// 触发share组件的保存海报功能
			this.setData({
				savePaint: true,
				uInfo: userInfo,
				share: true,
			});
		}
	},
	// 打开海报
	handleShare() {
		if (this.data.share) {
			this.setData({
				share: false,
			});
		} else {
			this.setData({
				share: true,
			});
		}
	},

	// 返回时的回调函数
	handleComfirm() {
		if (this.data.savePaint) {
			this.data.share = false;
		}
		this.setData({
			modal: false,
			savePaint: false,
			uInfo: null,
			share: this.data.share,
		});
	},

	// 监听海报错误事件
	handleShareErr(e) {
		wx.hideLoading();
		const { msg } = e.detail;
		if (msg === AUTH_FAIL.PHOTO) {
			this.setData({
				modal: true,
			});
		}
	},
	
	handleLoadSuc(e) {
		this.setData({
			itemList: this.data.tempList
		});
		wx.hideLoading();
	},

	// 搜索已解锁的二级建筑
	_searchMyBuild() {
		let mybuild = Store.get('mybuild');
		if(mybuild.length) {
			const imgList = mybuild.map(build => {
				return build.imgSrc;
			})
			wx.showLoading({
				mask: true
			});

			this.setData({
				tempList: mybuild || [],
				imgList: [...new Set(imgList)]
			})
		} else  {
			setTimeout(() => {
				wx.showToast({
					title: '暂无解锁内容，请赶紧获取木材去解锁',
					icon: 'none',
					duration: 2000
				})
			}, 30);
		}
	},

	// 检查错误
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

	handleShareTap() {
		console.log(111);
		this.tapShare = true;
	},

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},
});
