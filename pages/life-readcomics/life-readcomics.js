import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import { IDENTIFY, GAME_MODE } from '../../config/config';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { ShareCore, normalShareContent } from '../../utils/util';

Page({
	isShare: false,
	behaviors: [navBev, ImgBev],
	data: {},

	onLoad() {
    this._loadImgSrc();
		const readcomicsurl=wx.getStorageSync('readcomicsurl');
		this.setData({
			readcomicsurl:readcomicsurl
	});
	
	},
	onUnload(){
		
		var pages = getCurrentPages();
			var currPage = pages[pages.length - 1];   //当前页面
			var prevPage = pages[pages.length - 2];  //上一个页面
			
			//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
			
			//不需要页面更新
			prevPage.setData({
				shareshow: false
			})
		
		// wx.navigateBack();
	}
	
})