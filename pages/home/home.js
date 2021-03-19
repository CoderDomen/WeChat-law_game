import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import CommonModel from '../../model/commonModel';
import ImgBev from '../../behaviors/imgBev';
import { LOCAL_IMAGES_SRC } from '../../config/imgSrc';
import { GAME_MODE, IDENTIFY } from '../../config/config';
import { PRO_BASE_URL } from '../../config/URI';
import {
	checkUserStatus,
	checkEnviroment,
	ShareCore,
	normalShareContent,
} from '../../utils/util';

const common = new CommonModel();

Page({
	isShare: false,
	// 是否第一次注册
	_first: false,
	// 首次加载页面
	_firstload: true,
	// 分享控制锁
	_shareFlag: true,
	// 赛季过期
	expire: false,
	behaviors: [ImgBev],

	data: {
		test: false,
		// 工作环境
		env: checkEnviroment(),
		// 本地图片库
		local: LOCAL_IMAGES_SRC,
		// 提示玩法组件开关
		tip: false,
		// 注册奖励组件开关
		register: false,
		// 签到组件开关
		dailySign: false,
		// 金币
		coin: 0,
		// 护盾
		shield: 0,
		baseurl:PRO_BASE_URL,
		// 法律知识
		knows: [
			{
				type: 'icon1',
				title: '民法',
				detail: '专业法律知识的介绍',
			},
			{
				type: 'icon2',
				title: '宪法',
				detail: '专业法律知识的介绍',
			},
			{
				type: 'icon3',
				title: '未成年保护法',
				detail: '专业法律知识的介绍',
			},
			{
				type: 'icon4',
				title: '劳动法',
				detail: '专业法律知识的介绍',
			},
			{
				type: 'icon4',
				title: '婚姻法要点分析',
				detail: '专业法律知识的介绍',
			},
		],
		dailyData: null,
		// 签到组件
		sign: false,
		sign_data: 1,  //护盾数
		iconCount:11,  //金币数
		hightlight: [1],
		// 引导 icon top 偏移量数组
		topArr: null,
		// 引导层
		guide: false,
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		// 加载图片路径
		this._loadImgSrc();
		wx.showLoading({
			title: '正在加载',
			mask: true,
		});
		// 检查用户状态, 获取法律知识数据
		let [checkResult, knows] = await Promise.all([
			checkUserStatus(),
			common.getVideoSrc(),
		]);
		if (knows.message === 'success' && knows.data.length > 1) {
			knows = knows.data.map(know => {
				know.type = 'icon' + Math.ceil(Math.random() * 4);
				return know;
			});
			this._updateKnows(knows);
		} else {
			wx.showToast({
				title: knows.message || '知识之旅数据获取失败',
				icon: 'none',
			});
		}
		wx.hideLoading();
		this._first = checkResult.type === 'first';
		
		if (checkResult.login) {
			// 更新护盾和金币 && 缓存，my页面需要使用到
			this._updateDataNCache(checkResult);
			this._firstload = false;
			// 活动有效期
			this.expire = checkResult.data.season_ok ? false : true;
		}

		// 判断是否是被邀请进来的
		if (options.status && options.status === 'invite') {
			let JumpInfo = wx.getStorageSync('Jump');
			wx.removeStorageSync('Jump');
			if (JumpInfo) {
				const userInfo = UserModel.getUserInfo();
				if (
					JumpInfo.avatarUrl === userInfo.avatarUrl &&
					JumpInfo.nickName === userInfo.nickName
				) {
					return wx.showToast({
						title: '不能加入自己的房间喔',
						icon: 'none',
					});
				}
				wx.navigateTo({
					url: `/pages/folk-fright/folk-fright?type=${GAME_MODE.FRIEND}&status=${IDENTIFY.FRIEND}&room_id=${JumpInfo.room_id}&avatarUrl=${JumpInfo.avatarUrl}&nickName=${JumpInfo.nickName}`,
				});
				return;
			}
		}
		// 是否需要引导
		if (!Store.get('guide')) {
			this.setData({
				guide: true,
			});
		}
		// 计算 icon bounding值
		this._calcBounding();
	},

	async onShow() {
		// 分享
		if (this._shareFlag && this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			let elseInfo = Store.get('user');
			this.setData({
				coin: elseInfo.coin,
				shield: elseInfo.shield,
			});
			this.isShare = false;
		}

		if (!this._shareFlag) {
			this._shareLock();
			this.isShare = false;
			let shareRes = await common.shareReward(UserModel.hasUid());
			if (shareRes.successed) {
				wx.showToast({
					title: shareRes.msg || '分享成功',
					icon: 'none',
				});
				this.setData({
					coin: this.data.coin + shareRes.coin,
					shield: this.data.shield + shareRes.take_count,
				});
				UserModel.updateCacheUser('coin', this.data.coin);
				UserModel.updateCacheUser('shield', this.data.shield);
			} else {
				wx.showToast({
					title: shareRes.msg || '分享奖励失败',
					icon: 'none',
				});
			}
			this.handleShareClose();
		}

		// 刷新金币和护盾数量
		if (!this._firstload) {
			// 再次登录，获取最新数据
			wx.showLoading({
				mask: true
			});
			let loginRes = await checkUserStatus();
			if (loginRes.login) {
				// 走一套流程（更新缓存，更新数据）
				this._updateDataNCache(loginRes);
				wx.hideLoading();
			}
		}
	},

	onShareAppMessage() {
		this.isShare = true;
		if (!Store.get('tip')) {
			// 关闭分享锁
			this._shareUnLock();
		}
		return normalShareContent();
	},

	// 点击头像（open-type）类型
	async handleAvatar(e) {
		// if (this.expire) {
		// 	wx.showToast({
		// 		icon: 'none',
		// 		title: '活动已结束',
		// 	});
		// 	return;
		// }
		console.log(e);
		
		let { userInfo } = e.detail;
		if (userInfo) {
			const um = new UserModel();
			userInfo.userId = UserModel.hasUid();
			let res = await um.updateInfo(userInfo);
			if (res.data.successed) {
				Reflect.deleteProperty(userInfo, 'userId');
				UserModel.setUserInfo(userInfo);

				this._setTimeRecord();
				const userInfo2=wx.getStorageSync('userInfo');
				const uid2=wx.getStorageSync('uid');
				wx.request({
					url: this.data.baseurl+"/users",
					method: 'PUT',
					data:{
						userId:uid2,
						nickName:userInfo2.nickName,
						avatarUrl:userInfo2.avatarUrl,
					},
				})
			
				
					
				wx.navigateTo({
					url: '/pages/my/my',
				});
			} else {
				wx.showToast({
					title: '操作失败喔,请重试',
					icon: 'none',
				});
			}
		} else {
			wx.showToast({
				title: '请先授权',
				icon: 'none',
			});
		}
	},

	// tip组件关闭
	async handleShareClose() {
		Store.set('tip', 1);
		this.setData({
			tip: false,
			register: this._first,
		});
	},

	// 引导层结束
	handleGuideEnd() {
		Store.set('guide', 1);
		this.setData({
			guide: false,
		});
		// 判断是否要显示tip组件
		if (!Store.get('tip')) {
			this.setData({
				tip: true,
			});
		}
	},

	// 注册奖励组件关闭
	handleSmClose() {
		this.setData({
			register: false,
		});
	},

	// 注册奖励组件领取
	handleSmReceive() {
		this.setData({
			coin: this.data.coin + 5,
			shield: this.data.shield + 5,
		});
		UserModel.updateCacheUser('coin', this.data.coin);
		UserModel.updateCacheUser('shield', this.data.shield);
		wx.showToast({
			title: '领取成功',
			icon: 'none',
			success: () => {
				this.handleSmClose();
			},
		});
	},

	// 签到组件领取
	async handleDailyReceive() {
		let res = await common.signIn(UserModel.hasUid());
		if (res.successed) {			
			UserModel.updateCacheUser('shield', this.data.shield + res.take_count);
			this.data.dailyData.push(new Date().getDate());
			// 护盾奖励
			this.setData({
				shield: this.data.shield + res.take_count,
				coin: res.coin,
				sign: true,
				dailyData: this.data.dailyData,
			});
			wx.showToast({
				title: res.msg || '签到成功',
				icon: 'none',
				success: () => {
					this.handleDailyClose();
				},
			});
		} else {
			wx.showToast({
				title: res.msg || '签到失败',
				icon: 'none',
			});
		}
	},

	// 法律知识跳转至二级页面
	handleToDetail(e) {
		if (this.expire) {
			wx.showToast({
				icon: 'none',
				title: '活动已结束',
			});
			return;
		}
		const { env } = this.data;
		if (env === 'prod') {
			const { title, url: path, note, vid: id } = e.target.dataset;
			if (title && path && note && id) {
				wx.navigateTo({
					url: `/pages/knowledge-detail/knowledge-detail?title=${title}&url=${path}&note=${note}&vid=${id}`,
				});
			}
			return;
		} else if (env === 'dev') {
			const title = e.target.dataset.title;
			if (title) {
				wx.navigateTo({
					url: '/pages/knowledge-detail/knowledge-detail?title=' + title,
				});
			}
		}
	},

	// 签到组件关闭
	handleDailyClose() {
		this.setData({
			dailySign: false,
			dailyData: null,
		});
	},

	// 签到
	async handleSignIn() {
		if (this.expire) {
			wx.showToast({
				icon: 'none',
				title: '活动已结束',
			});
			return;
		}
		if (!this.data.dailyData) {
			wx.showLoading({
				title: '请稍等',
				mask: true,
			});
			let res = await common.getSign(UserModel.hasUid());
			console.log(res);
			
			// 判断今天是否已经签到
			const Day = new Date().getDate();
			let sign = false;
			res.day.forEach(day => {
				if (day === Day) {
					sign = true;
				}
			});
			wx.hideLoading();
			this.setData({
				dailySign: true,
				dailyData: res.day,
				sign,
				sign_data: res.hudun_add,
				iconCount:res.coin_add
			});
		} else {
			this.setData({
				dailySign: true,
			});
		}
	},

	// 路由跳转，我的详细
	goMy() {
		// if (this.expire) {
		// 	wx.showToast({
		// 		icon: 'none',
		// 		title: '活动已结束',
		// 	});
		// 	return;
		// }
		wx.navigateTo({
			url: '/pages/my/my',
		});
	},

	// 路由跳转，弓箭传说
	goArrow(e) {
		if (!this.data.hightlight.includes(+e.currentTarget.dataset.type)) {
			return wx.showToast({
				icon: 'none',
				title: '暂未开启，敬请期待',
			});
		}
		if (this.expire) {
			wx.showToast({
				icon: 'none',
				title: '活动已结束',
			});
			return;
		}
		wx.navigateTo({
			url: '/pages/arrow/arrow',
		});
	},

	// 路由跳转，弓箭传说
	goFolk(e) {
		if (!this.data.hightlight.includes(+e.currentTarget.dataset.type)) {
			return wx.showToast({
				icon: 'none',
				title: '暂未开启，敬请期待',
			});
		}
		if (this.expire) {
			wx.showToast({
				icon: 'none',
				title: '活动已结束',
			});
			return;
		}
		wx.navigateTo({
			url: '/pages/folk/folk',
		});
	},
	// 路由跳转，七彩人生路
	tolife(e) {
		if (!this.data.hightlight.includes(+e.currentTarget.dataset.type)) {
			return wx.showToast({
				icon: 'none',
				title: '暂未开启，敬请期待',
			});
		}
		if (this.expire) {
			wx.showToast({
				icon: 'none',
				title: '活动已结束',
			});
			return;
		}
		wx.navigateTo({
			url: '/pages/life_index/life',
		});
		
	},
	toSunny(e) {
		if (!this.data.hightlight.includes(+e.currentTarget.dataset.type)) {
			return wx.showToast({
				icon: 'none',
				title: '暂未开启，敬请期待',
			});
		}
		wx.navigateTo({
			url: '/pages/sunny/sunny'
		})
	},

	async toHappy(e) {
		if (!this.data.hightlight.includes(+e.currentTarget.dataset.type)) {
			return wx.showToast({
				icon: 'none',
				title: '暂未开启，敬请期待',
			});
		}
		let skip = Store.get('happy_intro');
		if (skip) {
			wx.navigateTo({
				url: '/pages/happy-home/happy-home',
			});
		} else {
			wx.navigateTo({
				url: '/pages/happy/happy',
			});
		}
	},

	// 领取奖励
	toPrice(e) {
		if (!this.data.hightlight.includes(+e.currentTarget.dataset.type)) {
			return wx.showToast({
				icon: 'none',
				// title: '暂未开启，敬请期待',
				title: '请继续闯关，丰厚奖品等你拿',
			});
		}
		wx.navigateTo({
			url: '/pages/price-detail/price-detail',
		});
	},

	// 设置记录时间
	_setTimeRecord() {
		// 七天
		let expire = 7 * 1000 * 3600 * 24;
		wx.setStorageSync('timestamp', Date.now() + expire);
	},

	// 更新知识点
	_updateKnows(knows) {
		this.setData({
			knows,
		});
	},
	// 关闭分享锁
	_shareUnLock() {
		this._shareFlag = false;
	},
	// 开启分享锁
	_shareLock() {
		this._shareFlag = true;
	},
	// 调用登录接口后，更新视图和缓存
	_updateDataNCache(res) {
		// res.data.heighlight = res.data.heighlight.filter(re => {
		// 	return ![3, 4].includes(re);
		// });
		this.setData({
			coin: res.data.coin,
			shield: res.data.hudun,
			hightlight: res.data.heighlight,
		});
		UserModel.saveUser2Cache({
			coin: res.data.coin,
			shield: res.data.hudun,
			address: res.data.address || '',
			mobile: res.data.mobile || '',
			// 小关
			gjSmall: res.data.gj_get_count || 0,
			// 大关
			gjBig: res.data.gj_get || 0,
			// 向阳而生生长状态
			tree_status: res.data.tree_stage || 1,
			// 木材数量
			mcsl: res.data.mcsl || 0,
			// 拥有的社区
			home_stage: res.data.home_stage || 0,
			// 社区下的房
			own_home: res.data.own_home || 0,
		});
	},

	// 计算各个 icon 的 bounding值
	_calcBounding() {
		let boundingArr = [];
		const query = wx.createSelectorQuery();
		query
			.selectAll('.level-item')
			.boundingClientRect()
			.exec(res => {
				if (res && res[0].length) {
					res[0].forEach(bounding => {
						boundingArr.push({
							name: bounding.id,
							top: bounding.top,
						});
					});
					this.setData({
						topArr: boundingArr,
					});
				}
			});
	},
});
