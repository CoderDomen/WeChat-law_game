import { CustromMenuButtonBoundingClientRect } from './utils/util';
App({
	async onLaunch() {
		
		wx.setKeepScreenOn({
			　　keepScreenOn: true,
			});
	
		let systemInfo = wx.getSystemInfoSync();
		let rect = wx.getMenuButtonBoundingClientRect
			? wx.getMenuButtonBoundingClientRect()
			: CustromMenuButtonBoundingClientRect(); //胶囊按钮位置信息
		//导航栏高度
		let navBarHeight = (function () {
			//动态计算每台手机状态栏到胶囊按钮间距
			let gap = rect.top - systemInfo.statusBarHeight;
			return 2 * gap + rect.height;
		})();
		this.globalData.navBarHeight = navBarHeight;
		this.globalData.top = rect.top;
		this.globalData.navBarLeft = systemInfo.windowWidth - rect.right;
		if (wx.canIUse('getUpdateManager')) {
			const updateManager = wx.getUpdateManager();
			updateManager.onUpdateReady(() => {
				wx.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							updateManager.applyUpdate();
						}
					},
				});
			});
		}
	},
	globalData: {
		navBarHeight: 0,
		navBarLeft: 0,
		top: 0,
	},
});
