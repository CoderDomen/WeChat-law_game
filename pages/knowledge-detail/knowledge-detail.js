import navBev from '../../behaviors/behavior.js';
import { LOCAL_IMAGES_SRC } from '../../config/imgSrc';
import ImgBev from '../../behaviors/imgBev';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import CommmonModel from '../../model/commonModel';
import { checkEnviroment, normalShareContent, ShareCore } from '../../utils/util';
import { CDN_BASE_URL } from '../../config/URI';

let cm = new CommmonModel();
Page({
	// 视频是否已经开始
	vstart: false,
	// 视频的上下文对象
	videoContext: null,

	behaviors: [navBev, ImgBev],
	isShare: false,
	data: {
		// 基地址
		base: CDN_BASE_URL,
		// 工作环境
		env: checkEnviroment(),
		// 倒计时
		downtime: 0,
		// 显示倒计时锁
		timeShow: false,
		// 标题
		title: '',
		// 本地图片
		local: LOCAL_IMAGES_SRC,
		mp4Src: null,
		// 知识点默认值
		knows: [
			// 实例 数据结构
			// {
			// 	type: 'icon1',
			// 	title: '民法',
			// 	detail: '专业法律知识的介绍',
			// }
		],
		// 显示文案
		clerk:
			'"公民生活越来越成为可见的、可计算的、可预期的"。 [1]个人信息已经成为信息社会的一种重要的社会资源。在信息社会的背景下，对个人信息的争夺，已经在社会各个领域逐渐蔓延，于是法律的介入已成为必然。		个人信息作为民法上一个全新的概念，各国在立法上有很大分歧。然而，个人信息的法律内涵却通过很多国家长期的立法过程而逐步显现。现在，个人信息已经发展成为一个明确的法律概念。在涉及个人信息保护的问题时，我国学术界经常使用三个词汇，即"个人数据"、"个人隐私"、"个人信息"。事实上，关于个人信息概念的法律界定，世界各国的立法并不统一。采用"个人隐私"概念的立法例主要有：1974年美国《隐私权法》、1981年以色列《隐私保护法》、1987年加拿大《隐私权法》、1988年澳大利亚《隐私权法》等；采用"个人信息"概念的立法例主要有：1978年奥地利《信息保护法》、1984年英国《自动处理个人信息的利用与其提供于公务规范法》等；采用"个人数据"概念的立法例主要有：1976年德国《防止个人数据处理滥用法》、1978年法国《数据保护法》。笔者认为，使用"个人信息"进行法律定义更能体现个人信息保护立法的目标和宗旨，更能准确反映私人信息这一领域的内涵和外延。这是由于个人信息保护立法的宗旨在于保护个人信息，而不仅仅只停留于保护个人隐私、数据或者资料。在最初的个人信息保护立法中，各国使用最多的是数据、资料处理等技术性概念，但随着人们理论认识和立法实践的逐步深入，世界各国立法越来越多地使用了个人信息这一概念。',
		// 副标题
		subtitle: '',
		vid: null,
	},

	async onLoad(options) {
		wx.showLoading();
		let knows = await cm.getVideoSrc();
		if (knows.message === 'success' && knows.data.length > 1) {
			wx.hideLoading();
			knows = knows.data.map(know => {
				know.type = 'icon' + Math.ceil(Math.random() * 4);
				return know;
			});
		} else {
			wx.showToast({
				title: knows.message || '知识之旅数据获取失败',
				icon: 'none',
			});
		}
		const { url, title, note, vid } = options;
		this.videoContext = wx.createVideoContext('video');
		const videoSrc = this.data.base + '/' + url;
		this.setData({
			title,
			mp4Src: videoSrc,
			knows,
			subtitle: note,
			vid,
		});
	},

	async onShow() {
		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.isShare = false;
		}
	},

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},

	// 点击播放
	async handleStart() {
		if (this.vstart) {
			return;
		}
		await cm.videoClick(UserModel.hasUid(), +this.data.vid);
		this.vstart = true;
	},

	// 视频播放结束
	async handleEnd() {
		wx.showLoading();

		let videoRes = await cm.videoReward(UserModel.hasUid(), +this.data.vid);
		if (videoRes.successed) {
			wx.showToast({
				title: videoRes.msg || '视频阅读完成',
				icon: 'none',
			});
			let user = Store.get('user');
			let [shield, coin] = videoRes.msg.match(/\d/g, '');
			UserModel.updateCacheUser('coin', user.coin + parseInt(coin));
			UserModel.updateCacheUser('shield', user.shield + parseInt(shield));
		} else {
			wx.showToast({
				title: videoRes.msg || '奖励失败',
				icon: 'none',
			});
		}
	},

	handleErr(e) {
		console.log(e);
		wx.showToast({
			title: '播放失败',
			icon: 'none',
		});
	},

	// 视频实时更新25ms一次
	handleTimeUpdate(e) {
		const { currentTime, duration } = e.detail;
		if (!duration) {
			return;
		}
		if (duration - currentTime <= 10) {
			if (!this.data.timeShow) {
				this.setData({
					timeShow: true,
					downtime: parseInt(duration - currentTime),
				});

				this.animate(
					'#downtime',
					[
						{ opacity: 0, offset: 0 },
						{ opacity: 1, offset: 1 },
					],
					300
				);

				return;
			}
			this.setData({
				downtime: parseInt(duration - currentTime),
			});
		}
	},

	// 点击播放按钮
	handleSelect(e) {
		const { env } = this.data;
		if (env === 'prod') {
			const { title, note, url, vid } = e.target.dataset;
			if (title && note && url && vid) {
				wx.showLoading();
				const videoSrc = this.data.base + '/' + url;
				this.setData({
					title,
					subtitle: note,
					mp4Src: videoSrc,
					vid,
					timeShow: false,
					downtime: 0
				});
				this.vstart = false;
				wx.hideLoading();
			}
		} else {
			const { title } = e.target.dataset;
			if (title) {
				wx.navigateTo({
					url: '/pages/knowledge-detail/knowledge-detail?title=' + title,
				});
			}
		}
	},

	// 声明周期页面隐藏
	onHide() {
		this.videoContext.pause();
	},
});
