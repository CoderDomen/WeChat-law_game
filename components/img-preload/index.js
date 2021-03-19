Component({
	properties: {
		imgList: Array,
	},

	data: {
		imgSrc: '',
		count: 0,
	},

	observers: {
		imgList(val) {
			if (val.length > 0) {
				this._initLoad();
			}
		},
	},

	methods: {
		// 加载成功
		handleLoad() {
			let { count } = this.data;
			const total = this.properties.imgList.length - 1;
			if (count >= total) {
				this.triggerEvent('success');
				return;
			}
			this.setData({
				imgSrc: this.properties.imgList[++count],
			});
			this.data.count = count;
			this.triggerEvent('load', {
				percent: parseInt((count / total) * 100),
			});
		},
		// 加载失败
		handleError() {
			let { count } = this.data;
			wx.showToast({
				title: '部分资源加载失败噢',
				icon: 'none',
			});
			this.setData({
				imgSrc: this.properties.imgList[++count],
			});
			this.data.count = count;
			this.triggerEvent('error');
		},
		// 初次加载
		_initLoad() {
			this.setData({
				imgSrc: this.properties.imgList[this.data.count],
			});
		},
	},
});
