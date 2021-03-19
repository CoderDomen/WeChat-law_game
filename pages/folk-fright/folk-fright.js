import navBev from '../../behaviors/behavior.js';
import ImgBev from '../../behaviors/imgBev';
import GameBev from '../../behaviors/game';
import {
	CAT,
	FOLK_RANDOM_TIME,
	IDENTIFY,
	GAME_MODE,
} from '../../config/config';
import UserModel from '../../model/userModel';
import friendMode from './type/friend';
import randomMode from './type/random';
import publicMode, { initScore } from './type/public';
import AnswerModel from '../../model/answerModel.js';
import { ShareCore, normalShareContent } from '../../utils/util';

Page({
	// 用来判断对方是否提前退出了
	_isExit: false,
	// 对方状态
	opstatus: null,
	// 自己状态
	mystatus: null,
	// 分享开关
	tapShare: false,
	// 是否分享
	isShare: false,

	behaviors: [navBev, GameBev, ImgBev],
	data: {
		// 最终结果奖励的金币数量，由于编写关系。不重新命名了
		Win_coin: 0,
		// 答题类型
		catid: CAT.FOLK,
		// 游戏类型
		type: '',
		// 我方用户信息
		userInfo: null,
		// 匹配对手倒计时
		time: FOLK_RANDOM_TIME,
		// 是否准备好开始
		readyPlay: false,
		// 匹配到随机对手
		getEnemy: false,
		// 对手头像
		enemyAvatarUrl: '',
		// 对手昵称
		enemyName: '',
		// frighting组件开关
		frighting: false, // false
		// 最终结果
		result: '',
		// 分享组件开关
		share: false,
		// 当前题目索引
		currQuIndex: 0,
		// 题目信息
		questions: [],
		// 答题正确数目
		rightCount: 0,
		// 进入下一题的开关
		nextFlag: false,
		// 选择的答案
		selectResult: '',
		// 是否结束
		isEnd: false,
		// 双方分数
		score: JSON.parse(initScore),
		// 用户点击导航栏返回按钮时变为true, 监听其操作清理定时器
		close: false,
		// 房间号
		roomId: 0,
		// 用户身份
		ID_status: null,
		// 之前未授权过, 对对方而言
		openType: false,
		// 双人对战结束标识
		friendFrightEnd: false,
		// 本地成绩库
		localScore: 0,
		// 单人答题的成绩管理
		singleScore: {
			// 错误题目的id号
			wronglist: [],
			// 正确题目的id号
			rightlist: [],
		},
		// 自定义modal开关
		modal: false,
		// randomSelect随机挑战记录的开关
		randomSelect: false,
		// 进入下一题
		next: false,
		// 音乐实例摧毁
		musicDestory: false
	},

	async onLoad(options) {
		this._loadImgSrc();
		const { type, status, room_id } = options;
		console.log(type);
		if (type === GAME_MODE.FRIEND) {
			Object.assign(this, friendMode, publicMode);
		} else if (type === GAME_MODE.RANDOM) {
			Object.assign(this, randomMode, publicMode);
		}
		// 区分身份
		if (+status === IDENTIFY.FRIEND && room_id) {
			const { avatarUrl, nickName } = options;
			this.data.roomId = room_id;
			this.data.enemyAvatarUrl = avatarUrl;
			this.data.enemyName = nickName;
		}
		console.log(type);
		this.setData({
			// 游戏模式
			type,
			ID_status: +status,
			userInfo: UserModel.getUserInfo(),
		});
		this._matchGameMode(type);
	},

	async onShow() {
		if (this.isShare) {
			let type = 0;
			if (this.tapShare) {
				type = 1;
			}
			await ShareCore.call(this, type);
			this.tapShare = false;
			this.isShare = false;
		}
	},

	async onUnload() {
		this.setData({
			close: true,
			musicDestory: true
		});
		if (this.data.type === GAME_MODE.FRIEND) {
			this._stopTrain();
			// 同时提交结果,
			if (!this.data.isEnd && this.data.frighting) {
				let am = new AnswerModel();
				let res = await am.uploadAnswer(
					UserModel.hasUid(),
					this.data.roomId,
					this.data.score.my.result,
					-1,
					true
				);
				// 本地护盾-1
				let { shield } = Store.get('user');
				UserModel.updateCacheUser('shield', shield - 1);
				console.log(res, '结束');
			}
		}
	},

	handleShareTap() {
		this.tapShare = true;
	},

	// 对手头像加载错误
	handleEnemyAvatarErr() {
		this.setData({
			enemyAvatarUrl: '',
		});
	},

	// 保存图片错误的操作
	handleSaveErr() {
		this.setData({
			modal: true,
		});
	},

	// 关闭openSetting后的回调
	handleBackOpenSetting() {
		this.setData({
			modal: false,
		});
	},

	onShareAppMessage() {
		// this.isShare = true;
		if (this.data.type === GAME_MODE.FRIEND) {
			if (!this.data.isEnd) {
				let { avatarUrl, nickName } = UserModel.getUserInfo();
				const path = `/pages/index/index?type=${GAME_MODE.FRIEND}&status=${IDENTIFY.FRIEND}&room_id=${this.data.roomId}&avatarUrl=${avatarUrl}&nickName=${nickName}`;
				return {
					title: '普法总动员, 等你来挑战!',
					path,
					imageUrl: this.data.ImgRes.FOLK_FRIGHT_INVITE,
				};
			}
		}
		return normalShareContent();
	},
});
