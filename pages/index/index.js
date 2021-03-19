import Store from '../../model/storeModel';
import { LOCAL_IMAGES_SRC } from '../../config/imgSrc';
import { ShareCore, normalShareContent } from '../../utils/util';

Page({
	// 定时器
	timer: null,
	preloadSuccess: true,
	isShare: false,
	data: {
		local: LOCAL_IMAGES_SRC,
		loading: 0,
		imageList: Store.preloadImgList(),
		room_id: null,
		preload: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 是否邀请链接
		if (options.room_id) {
			wx.setStorageSync('Jump', options);
			this.data.room_id = options.room_id;
		}
		// 判断是否已经有缓存数据
		if (!Store.hasSourceSign()) {
			this.setData({
				preload: true,
			});
			return;
		}
		if (options.room_id && Store.hasSourceSign()) {
			this._navigate();
		} else {
			this._loading();
		}
	},

	async onShow() {
		if(this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.isShare = false;
		}
	},

	// 图片预加载错误
	handleImgError() {
		this.preloadSuccess = false;
	},
	// 图片预加载成功
	hanldeImgLoad(e) {
		const { percent } = e.detail;
		if (percent === 100) {
			if (this.preloadSuccess) {
				Store.setSourceCacheSign();
			}
			this._navigate();
		}
		this.setData({
			loading: percent,
		});
	},

	// 跳转
	_navigate() {
		let path = '';
		if (this.data.room_id) {
			path = '/pages/home/home?status=invite';
		} else {
			path = '/pages/home/home';
		}
		setTimeout(() => {
			wx.reLaunch({
				url: path,
			});
		}, 1000);
	},
	// mock加载
	_loading() {
		this.timer = setInterval(() => {
			if (this.data.loading >= 100) {
				clearInterval(this.timer);
				this._navigate();
				return;
			}
			this.setData({
				loading: ++this.data.loading,
			});
		}, 40);
	},

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},
});
