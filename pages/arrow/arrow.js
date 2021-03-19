import navBev from '../../behaviors/behavior';
import gameBev from '../../behaviors/game';
import {
	ANSWER_TYPE,
	SEXTYPE,
	CAT,
	HARD,
	RANK_TITLE,
} from '../../config/config';
import ImgRes, { LOCAL_IMAGES_SRC } from '../../config/imgSrc';
import QuestionModel from '../../model/questionModel';
import { 
	transformAnswer, 
	checkGongAvatar, 
	matchHard, 
	ShareCore,
	normalShareContent
} from '../../utils/util';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import AnswerModel from '../../model/answerModel';
import { PRO_BASE_URL } from '../../config/URI';
const am = new AnswerModel();
// 问题模型
const qm = new QuestionModel();

const pageBg = {
	role: ImgRes.ARROW_ROLE_BG,
	rank: ImgRes.ARROW_RANK_BG,
};

const MODE = {
	// 角色选择模式
	ROLE: 0,
	// 难度选择模式
	RANK: 1,
	// 答题模式
	SUBJECT: 2,
};

Page({
	baseurl:PRO_BASE_URL,
	tapShare: false,
	isShare: false,
	behaviors: [navBev, gameBev],
	data: {
		gjSex:'',
		baseurl:PRO_BASE_URL,
		// 获胜取得的金币奖励
		win_coin: 0,
		// 难度
		hard: HARD.L1,
		// 头衔
		rankTitle: '',
		// 答题类型
		catid: CAT.ARROW,
		// 模式
		game_type: null,
		// 背景src
		pageBg: LOCAL_IMAGES_SRC.ALL_BG_WHITE,
		// 性别
		sexType: null,
		// 选择的答案
		selectResult: '',
		// 是否结束
		isEnd: false,
		// fail, win
		result: null,
		// answer组件
		answerType: 0,
		resultType: null,
		// 分享，控制组件
		share: false,
		// 当前题目索引
		currQuIndex: 0,
		// 题目信息
		questions: [],
		// 答题正确数目
		rightCount: 0,
		// 进入下一题的开关
		nextFlag: false,
		// 答案解释
		explain: '',
		// 答案字段
		field: null,
		// 要预加载的图片字段
		preSrc: '',
		// 用户的闯关进度
		progress: null,
		isDisabled: false,
		singleScore: {
			// 错误题目的id号
			wronglist: [],
			// 正确题目的id号
			rightlist: [],
		},
		modal: false,
		musicDestory: false,
	},

	onLoad: function (options) {
		// 判断有无选择过性别
		const uuid=wx.getStorageSync('uid');
		wx.request({
			url: this.data.baseurl+"/getUserGjInfo",
			method: 'GET',
			data:{
				uid:uuid,
			},
			success: (res) => {
				if(res.data.data.hasSex){
					this.data.gjSex = res.data.data.gjSex;
					console.log(res.data);
					// wx.setStorage({
					// 	data:res.data.gjSex,
					// 	key: 'gjSex',
					// });
					this.setData({
						gjSex:res.data.data.gjSex,
						game_type:MODE.RANK,
						hard:res.data.data.gjGet,
						progress:res.data.data.gjGetCount,
						rankTitle: RANK_TITLE[res.data.data.gjGet - 1],
					});
				}else{
					this.setData({
						game_type:MODE.ROLE
					});
				}
			}
		});
		
		let sexType = UserModel.getGameSexInfo(),
			flag = false;
		if (sexType === SEXTYPE.BOY || sexType === SEXTYPE.GIRL || this.data.gjSex !== null) {
			flag = true;
		}
		// 匹配难度
		const elseInfo = Store.get('user');
		console.log(elseInfo);
		console.log(this.data.gjSex);
		// this.setData({
			// sexType,
			// game_type: flag ? MODE.RANK : MODE.ROLE,
			// hard: matchHard(elseInfo.gjBig),
			// progress: elseInfo.gjSmall,
		
		// });
		// 设置头衔名称
		this._setRankTitle();
		this._setBg();
	},

	onUnload() {
		this.setData({
			musicDestory: true
		})
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

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},

	// 分享组件点击转发好友
	handleShareTap() {
		this.tapShare = true;
	},

	// 保存错误
	handleSaveErr() {
		this.setData({
			modal: true,
		});
	},

	// 监听预加载成功事件
	handlePreload() {
		wx.hideLoading();
		this.setData({
			game_type: MODE.RANK,
			sexType: UserModel.getGameSexInfo(),
		});
		this._setBg();
	},

	// 分享组件关闭
	handleShareClose() {
		this.setData({
			share: false,
		});
		wx.navigateBack();
	},

	// 结果组件继续挑战
	handleContinueOnResult() {
		
		this.setData({
			selectResult: '',
			isEnd: false,
			result: null,
			answerType: 0,
			resultType: null,
			currQuIndex: 0,
			questions: [],
			rightCount: 0,
			nextFlag: false,
		});
		
		this.setData({
			isDisabled: false,
		});
		wx.redirectTo({
			url: '/pages/arrow/arrow'
		})
		// this.handleContinue();
	},

	// 结果组件返回
	handleBack() {
		wx.navigateBack();
	},

	// 结果组件分享
	handleShare() {
		console.log(111);
		// 打开分享的绑定数据
		this.setData({
			share: true,
			isEnd: false,
		});
	},

	// 进入下一题
	async handleNext() {
		this.setData({
			nextque:false
		})
		console.log(this.data.nextFlag);
		console.log(this._isEnd());
		if (!this.data.nextFlag) {
			return;
		}
		// 进入下一题
		// 判断是否已经是最后一道题
		if (this._isEnd()) {
			// 上传分数
			this.setData({
				isDisabled: true,
			});
			// 上传分数接口
			wx.showLoading();
			let uploadRes = await am.uploadAnswerBySingle({
				uid: UserModel.hasUid(),
				wronglist: this.data.singleScore.wronglist,
				rightlist: this.data.singleScore.rightlist,
				cat_id: this.data.catid,
			});

			if (uploadRes.successed) {
				wx.showToast({
					title: uploadRes.msg,
					icon: 'none',
				});
				console.log(this._canIpass(uploadRes.pass));
				if (this._canIpass(uploadRes.pass, true)) {
					const coin_num = uploadRes.coin;
					let elseInfo = Store.get('user');
					UserModel.updateCacheUser('coin', elseInfo.coin + coin_num);
					// 增加通关数量
					let { gjSmall, gjBig } = Store.get('user');
					gjBig = gjSmall >= 3 ? Math.min(gjBig + 1, 5) : gjBig;
					gjSmall = Math.max(++gjSmall % 4, 1);
					console.log(gjBig+"***"+gjSmall);
					UserModel.updateCacheUser('gjSmall', gjSmall);
					UserModel.updateCacheUser('gjBig', gjBig);
					console.log(Store.get('user'));
					
				}
				this.setData({
					resultType: this._canIpass(uploadRes.pass),
					selectResult: '',
					isEnd: true,
					win_coin: uploadRes.coin,
				});
			} else {
				this.setData({
					isDisabled: false,
				});
				wx.showToast({
					title: '发生错误,计算奖励失效',
					icon: 'none',
				});
			}
		} else {
			this._reback();
			this.setData({
				currQuIndex: ++this.data.currQuIndex,
			});
		}
	},

	// openSetting回调
	handleBackOpenSetting() {
		this.setData({
			modal: false,
		});
	},

	// 答案选择
	handleSelect(e) {
		const { result } = e.detail;
		this._recordId(result);
		// 计算答对的题目数目
		if (result === ANSWER_TYPE.RIGHT) {
			// 答对了
			this.setData({
				rightCount: this.data.rightCount + 1,
				nextque:true,
			});
			this.data.nextFlag = true;
			this.handleNext();
		}else{

		// 延迟展示结果
		setTimeout(() => {
			this.setData({
				selectResult: result,
				answerType: result === ANSWER_TYPE.RIGHT ? 1 : 0,
				nextFlag: false,
				explain: this.data.questions[this.data.currQuIndex].note,
				field: this.data.questions[this.data.currQuIndex].ans,
				nextque:true,
			});
			this.data.nextFlag = true;
			// setTimeout(() => {
			// }, 2000);
		}, 1000);

		}
	},

	// 继续挑战
	async handleContinue() {
	
		let { gjSmall, gjBig } = Store.get('user');
		if (gjBig >= 5 && gjSmall >= 4) {
			return wx.showToast({
				title: '您已通过所有关卡',
				icon: 'none'
			});
		}
		if (UserModel.getCacheUser('shield') <= 0) {
			return wx.showToast({
				title: '护盾已用完',
				icon: 'none'
			});
		}
		wx.showLoading({
			title: '加载中',
			mask: true,
		});
		let uid = this._getUid();
		// 答题类型， 当前的难度等级
		let { catid, hard } = this.data;
		// 获取题目信息
		let { data: questions, message } = await qm.get(uid, catid);
		console.log(questions);
		if (questions) {
			if (questions.length > 0) {
				// 本地护盾-1
				let { shield } = Store.get('user');
				UserModel.updateCacheUser('shield', shield - 1);

				questions.forEach(item => {
					item.ans = transformAnswer(item.ans);
				});
				console.log(questions);
				this.setData({
					game_type: MODE.SUBJECT,
					questions,
				});
				wx.hideLoading();
			} else {
				wx.showToast({
					title: message || '获取题目失败',
					icon: 'none',
				});
			}
		} else {
			wx.showToast({
				title: '出错了喔',
				icon: 'none',
			});
		}
	},

	// role层, 开始挑战
	handleStart(e) {
		const { sex } = e.detail;
		console.log(sex);
		const uuid=wx.getStorageSync('uid');
		wx.request({
			url: this.data.baseurl+"/setGjSex",
			method: 'POST',
			data:{
				uid:uuid,
				gjSex:sex
			},
			success: (res) => {
				
			}
		});
		// 记录性别
		this._setSexInfo(sex);
		wx.showLoading({
			title: '加载中...',
			mask: true,
		});
		const user = Store.get('user');
		this.setData({
			// 等待接口
			preSrc: checkGongAvatar(sex, user.gjBig),
			gjSex:sex,
		});
	},

	// 设置头衔名称
	_setRankTitle() {
		this.setData({
			rankTitle: RANK_TITLE[this.data.hard - 1],
		});
	},

	// 根据场景类型选择背景
	_setBg() {
		const { game_type } = this.data;
		const bg_img = game_type === MODE.ROLE ? pageBg.role : pageBg.rank;
		this.setData({
			pageBg: bg_img,
		});
	},
	// 设置性别信息
	_setSexInfo(sex) {
		Store.set('sexType', sex);
	},
	// 恢复设置
	_reback() {
		this.setData({
			selectResult: '',
			answerType: 0,
			explain: '',
			field: null,
		});
	},
	// 判断是否是最后一题
	_isEnd() {
		// 这里 +1 是因为上面，需要在答题数目自增前，判断是否已经答题完毕。
		// 此时的 currQuIndex 还是旧的index
		return this.data.currQuIndex + 1 >= this.data.questions.length;
	},
	// 判断闯关结果
	_canIpass(pass, useBool) {
		let result = null;
		if (pass) {
			result = 0;
		} else {
			if (this.data.gjSex === SEXTYPE.BOY) {
				result = 1;
			} else if (this.data.gjSex === SEXTYPE.GIRL) {
				result = 2;
			}
		}
		if (useBool) {
			return result === 0 ? true : false;
		}
		return result;
	},
	// 记录id result boolean
	_recordId(result) {
		const que = this.data.questions[this.data.currQuIndex];
		if (result === ANSWER_TYPE.RIGHT) {
			this.data.singleScore.rightlist.push(que.id);
		} else {
			this.data.singleScore.wronglist.push(que.id);
		}
	},
});
