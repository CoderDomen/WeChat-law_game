import Store  from '../../model/storeModel';
import ImgBev from '../../behaviors/imgBev';

const app = getApp();
const TYPE = {
	AVATAR: 'avatar',
	BACK: 'back',
};


Component({

	options: {
		multipleSlots: true
	},

	properties: {
		// 导航栏类型 头像导航栏 / 普通导航栏
		type: String,
		// 标题内容
		title: String,
		// 标题是否居中显示
		center: Boolean,
		// 标题颜色
		color: String,
		// 金币
		coin: Number,
		// 护盾
		shield: Number,
		// 自定义back
		customB: Boolean
	},
	behaviors: [ImgBev],
	/**
	 * 组件的初始数据
	 */
	data: {
		top: 0,
		navBarHeight: 0,
		navBarLeft: 0,
		expire: false,
	},

	attached() {
		this._setNavInfo();
		// avatar类型
		if (this.properties.type === TYPE.AVATAR) {
			// 是否超时
			let timeStamp = this._getTimeRecord();
			if (!timeStamp || (timeStamp && Date.now() > timeStamp)) {
				// 过期
				console.log('过期');
				this.setData({
					expire: true,
				});
			}
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {

		goMy() {
			this.triggerEvent('goMy');
		},

		handleBack() {
			if(this.properties.customB) {
				this.triggerEvent('back');
				return;	
			}
			this.triggerEvent('back');
			wx.navigateBack();
		},
		
		onAvatarButtonTap(e) {
			const userInfo = e.detail.userInfo
			this.triggerEvent('onAvatar', {
				userInfo
			});
			// 点击头像，并获取到用户信息
			// 同时记录时间
		},
		/**
		 * 设置导航栏高度和偏移量
		 * @returns {any}
		 */
		_setNavInfo() {
			this.setData({
				top: app.globalData.top,
				navBarHeight: app.globalData.navBarHeight,
				navBarLeft: app.globalData.navBarLeft,
			});
		},
		// 获取时间戳
		_getTimeRecord() {
			let timestamp = Store.get('timestamp');
			return timestamp || false;
		},
	},
});
