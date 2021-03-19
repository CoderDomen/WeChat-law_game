import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import QuestionModel from '../../model/questionModel';
import AnswerModel from '../../model/answerModel';
import ImgSrc from '../../config/imgSrc';
import UserModel from '../../model/userModel';
import {
	CAT,
	SUNNY_ZH_MAP,
	ANSWER_TYPE,
	SUNNY_DOWN_TIME,
} from '../../config/config';
import Store from '../../model/storeModel';
import {
	transformAnswer,
	ShareCore,
	normalShareContent,
} from '../../utils/util';
import SunnyAnimate from '../../animatie/sunny';
import EV from '../../class/event';

const qm = new QuestionModel();
const am = new AnswerModel();
let ani = null;

// 通关结果
const PASS_RESULT = {
	SUCCESS: 'success',
	FAIL: 'fail',
};

Page({
	downTimer: null,
	AnsweredFlag: false,
	isShare: false,
	nextFlag: false,
	emit: false,

	behaviors: [navBev, ImgBev],
	data: {
		// 向阳而生，弓箭传说...
		catid: CAT.SUN,
		// 浇水 太阳...
		type: null,
		// 标题
		title: '中华人民共和国的自由,哪项不符合法律法规?',
		// 选项
		options: ['言论', '示威', '集合', '斗殴'],
		// 答案解释
		answer: '国家规定示威在国内不是自由的',
		// 错误倒计时
		timer: SUNNY_DOWN_TIME,
		// 弹出层
		pop: false,
		// 导航栏标题
		nav_title: null,
		// 导航栏进度
		nav_pro: null,
		nav_total:null,
		// 选项结果
		result: '',
		// 激活选项
		activeIndex: null,
		// 结果背景 SUNNY_ERROR_BG, SUNNY_RIGHT_BG
		resultBg: '',
		// 锁
		selectFlag: true,
		// 答案索引
		AnswerIndex: null,
		// 选择答案
		selected: false,
		// 题目
		questions: null,
		// 当前题目索引
		currQuIndex: 0,
		// 准备好开始倒计时
		start: false,
		// 控制tips和下一题按钮的锁
		showFlag: false,
		singleScore: {
			// 错误题目的id号
			wronglist: [],
			// 正确题目的id号
			rightlist: [],
		},
		// 通关结果
		pass: '',
		close: false,
		// 滑动距离
		scrollTop: 0,
		// 超时
		timeout: false,
		// 倒计时
		down_time: 0,
	},

	async onLoad(options) {
		// 动画
		ani = new SunnyAnimate(this);
		wx.showLoading();
		const { type, pro,total } = options;
		console.log(type, pro,total);
		
		// 匹配标题
		const title = SUNNY_ZH_MAP[type];
		this.setData({
			nav_title: title,
			nav_pro: pro,
			nav_total:total,
			type,
		});
		// 先获取题目
		let QueRes = await qm.get(UserModel.hasUid(), this.data.catid, type);
		if (QueRes.data && QueRes.data.length > 0) {
			const questions = QueRes.data;
			// todo
			// 本地护盾-1
			let { shield } = Store.get('user');
			UserModel.updateCacheUser('shield', shield - 1);

			questions.forEach(item => {
				item.rawAns = item.ans;
				item.ans = transformAnswer(item.ans);
			});
			this.setData({
				questions,
			});
			this._formatQuestion();
			// 开场动画
			ani.openAnimation(() => {
				this.setData({
					start: true,
					selectFlag: false,
				});
			});
		} else {
			// 发生错误
			Store.set('sunny_error', QueRes.message || '获取题目失败');
			wx.navigateBack();
		}
		wx.hideLoading();
	},

	async onShow() {
		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.isShare = false;
		}
	},

	async onUnload() {
		// 停止定时器
		this.setData({
			close: true,
		});
		if (
			this.data.questions &&
			this.data.questions.length > 0 &&
			!this._isFlag()
		) {
			this.data.questions.forEach(item => {
				this.data.singleScore.wronglist.push(item.id);
			});
			const updateRes = await am.uploadAnswerBySingle({
				uid: UserModel.hasUid(),
				wronglist: this.data.singleScore.wronglist,
				rightlist: [],
				cat_id: this.data.catid,
				hard: +this.data.type,
			});
			if (updateRes.interval) {
				this.data.down_time = updateRes.interval * 1000;
				// 设置倒计时
				this._setDownTime();
			} else if (!updateRes.successed) {
				// 发生错误
				Store.set('sunny_error', updateRes.msg || '发生错误哦');
			}
		}
	},

	onShareAppMessage() {
		this.isShare = true;
		return normalShareContent();
	},

	// 选项选中
	handleSelect(e) {
		// 获取选中目标
		if (this.data.selectFlag) {
			return;
		}
		// 把点击选项的锁开启
		this.data.selectFlag = true;
		const { index } = e.target.dataset;
		
		if(this.data.AnswerIndex=='A'){
			this.data.AnswerIndex= 1;
		}else if(this.data.AnswerIndex=='B'){
			this.data.AnswerIndex = 2;
		}else if(this.data.AnswerIndex=='C'){
			this.data.AnswerIndex = 3;
		}else{
			this.data.AnswerIndex = 4;
		}
		let result = index === this.data.AnswerIndex;
		console.log(index);
		console.log(this.data.AnswerIndex);
		this.setData({
			result: result ? ANSWER_TYPE.RIGHT : ANSWER_TYPE.ERROR,
			resultBg: result ? ImgSrc.SUNNY_RIGHT_BG : ImgSrc.SUNNY_ERROR_BG,
			activeIndex: index,
			selected: true,
			showFlag: true,
		});

		// 正确
		if (this.data.result === ANSWER_TYPE.RIGHT) {
			// 插入正确数组中
			this.data.singleScore.rightlist.push(
				this.data.questions[this.data.currQuIndex].id
			);
			setTimeout(() => {
				this._next(true);
			}, 1000);
		}
		// 错误
		if (this.data.result === ANSWER_TYPE.ERROR) {
			// 插入错误数组中
			this.data.singleScore.wronglist.push(
				this.data.questions[this.data.currQuIndex].id
			);
			// 提示动画
			ani.tipsAnimation(
				this.data.activeIndex,
				this._matchTop(this.data.activeIndex),
				this._2Scroll.bind(this)
			);
			// 下一题按钮动画
			ani.nextAnimation(() => {
				this._startDownTime();
			});
		}
	},

	_2Scroll() {
		const query = wx.createSelectorQuery();
		query.select('#contentBox').fields({
			size: true,
			scrollOffset: true,
			rect: true,
		});
		query.exec(res => {
			let height = 0;
			res.forEach(r => {
				height += r.height;
			});
			// 根据tips高度移动
			this.setData({
				scrollTop: height,
			});
		});
	},

	// 超时
	handleProStop() {
		// 插入错误数组中
		this.data.singleScore.wronglist.push(
			this.data.questions[this.data.currQuIndex].id
		);
		if(this.data.AnswerIndex=='A'){
			this.data.AnswerIndex= 1;
		}else if(this.data.AnswerIndex=='B'){
			this.data.AnswerIndex = 2;
		}else if(this.data.AnswerIndex=='C'){
			this.data.AnswerIndex = 3;
		}else{
			this.data.AnswerIndex = 4;
		}
		// 显示正确答案
		this.setData({
			activeIndex: this.data.AnswerIndex,
			result: ANSWER_TYPE.RIGHT,
			resultBg: ImgSrc.SUNNY_RIGHT_BG,
			// 开启锁
			selectFlag: true,
			showFlag: true,
			timeout: true,
		});
		// 提示动画
		ani.tipsAnimation(
			this.data.activeIndex,
			this._matchTop(this.data.activeIndex),
			this._2Scroll.bind(this)
		);
		// 下一题按钮动画
		ani.nextAnimation();
		// 显示提示 (重置参数，切换下一题);
		this._startDownTime();

		// setTimeout(() => {
		// 	this._next();
		// }, 1000);
	},

	// 下一题按钮
	handleNext() {
		// 加锁
		if (this.nextFlag) {
			return;
		}
		clearInterval(this.downTimer);
		this.setData({
			showFlag: false,
		});
		this._next(true);
		this.nextFlag = true;
	},
	// 关闭错误提示
	closetip(){
		this.setData({
			showFlag: false,
			shownext:true,
		});
	},
	// 关闭弹窗
	handleResultClose() {
		
		this.setData({
			pop: false,
		});
		// 设置倒计时
		this._setDownTime();
	// 	wx.redirectTo({   
  //     url:"/pages/sunny/sunny"
	//  });
	wx.navigateBack({
		delta: 1,
		});
		// wx.navigateBack();
	},

	// 设置倒计时
	_setDownTime() {
		let sunny_down = Store.get('sunny_down');
		if (sunny_down && sunny_down.types.length > 0) {
			sunny_down.types.push(+this.data.type);
			sunny_down[this.data.type] = Date.now() + this.data.down_time;
		} else {
			sunny_down = {
				types: [+this.data.type],
				[this.data.type]: Date.now() + this.data.down_time,
			};
		}
		// 计时标识
		Store.set('sunny_down', sunny_down);
		console.log('emit');
		EV.emit('time_down');
		this.emit = true;
		this._setFlag();
	},

	// 打标识
	_setFlag() {
		this.AnsweredFlag = true;
	},
	// 是否标识已经打下
	_isFlag() {
		return this.AnsweredFlag;
	},

	// 格式化问题数据
	_formatQuestion() {
		const question = this.data.questions[this.data.currQuIndex];
		const keys = Object.keys(question);
		let queObj = {
			title: '',
			options: [],
			AnswerIndex: null,
			answer: null,
		};
		if (keys.length) {
			keys.forEach(key => {
				if (key.includes('que')) {
					queObj.title = question[key];
				}
				if (key.includes('opt')) {
					queObj.options.push(question[key]);
				}
				if (key.includes('ans')) {
					queObj.AnswerIndex = question[key];
				}
				if (key.includes('note')) {
					queObj.answer = question[key];
				}
			});
		}
		this.setData({
			title: queObj.title,
			options: queObj.options,
			AnswerIndex: queObj.AnswerIndex,
			answer: queObj.answer,
		});
	},

	// 清空参数
	_clearParames() {
		this.setData({
			activeIndex: null,
			result: '',
			resultBg: '',
			// 开启锁
			selectFlag: false,
			showFlag: false,
			selected: false,
		});
	},

	// 超时，错误.开始倒计时
	_startDownTime() {
		this.downTimer = setInterval(() => {
			if (this.data.timer <= 0) {
				clearInterval(this.downTimer);
				// this._next(true);
				this.setData({
					showFlag: false,
					shownext:true,
				});
				return;
			}
			this.setData({
				timer: this.data.timer - 1,
			});
		}, 1000);
	},

	/**
	 * 下一题
	 * @param {any} isError	是否错误模式
	 * @returns {any}
	 */
	async _next(isError) {
		const { currQuIndex, questions } = this.data;
		if (currQuIndex + 1 >= questions.length) {
			wx.showLoading();
			// 上传结果
			const updateRes = await am.uploadAnswerBySingle({
				uid: UserModel.hasUid(),
				wronglist: this.data.singleScore.wronglist,
				rightlist: this.data.singleScore.rightlist,
				cat_id: this.data.catid,
				hard: +this.data.type,
			});

			wx.showToast({
				title: updateRes.msg,
				icon: 'none',
			});

			// 判断结果
			if (updateRes.successed) {
				clearInterval(this.downTimer);
				this.setData({
					isDisabled: true,
				});
				// 通关成功
				this.setData({
					pop: true,
					pass: PASS_RESULT.SUCCESS,
					down_time: updateRes.interval * 1000,
				});
			} else {
				// 通关失败
				this.setData({
					pop: true,
					pass: PASS_RESULT.FAIL,
					down_time: updateRes.interval * 1000,
				});
			}

			wx.showToast({
				title: updateRes.msg || '答题结束',
				icon: 'none',
			});
			return;
		}

		// 离场动画
		ani.leaveAnimation(() => {
			// 重置参数，切换题目
			this._clearParames();
			this.setData({
				currQuIndex: this.data.currQuIndex + 1,
				timer: SUNNY_DOWN_TIME,
				scrollTop: 0,
			});
			this._formatQuestion();
			// 进入下一题, 动画
			ani.openAnimation(() => {
				this.nextFlag = false;
			});
		});
		if (isError) {
			// 下一题按钮离场
			ani.nextLeaveAnimation();
		}
	},

	// 匹配选项top值
	_matchTop(index) {
		return 100 + '%';
	},
});
