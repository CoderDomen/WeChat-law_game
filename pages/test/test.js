import UserModel from '../../model/userModel';
import AnswerModel from '../../model/answerModel';
import ImgSrc from '../../config/imgSrc';
import { getImgSrc } from '../../utils/util';
import ImgBev from '../../behaviors/imgBev';
import ShareBev from '../../behaviors/share';
import { MUSIC_MANAGER } from '../../config/config';

let um = new UserModel();
let am = new AnswerModel();

const imgList = Object.keys(ImgSrc).map(key => ImgSrc[key]);
Page({
	timer: null,
	behaviors: [ImgBev, ShareBev],
	data: {
		imageList: imgList,
		percent: 0
	},

	onLoad: async function (options) {
		MUSIC_MANAGER.src = 'http://m8.music.126.net/20200821101450/177b1d1c568254362e03bca3a26b1fe2/ymusic/fa93/8f0c/2482/169cde31749db4666b02d0be3957630d.mp3';
		MUSIC_MANAGER.play();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},

	loadFinish(e) {
		console.log(e);
	},
	
	async getImgInfo() {
		let path = await getImgSrc(this.data.imageList[0]);
		wx.saveImageToPhotosAlbum({
			filePath: path,
		});
	}
});
