import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import ImgSrc from '../../config/imgSrc';
import HappyAnimate from '../../animatie/happy';
import QuestionModel from '../../model/questionModel';
import AnswerModel from '../../model/answerModel';
import { CAT, ANSWER_TYPE, SUNNY_DOWN_TIME } from '../../config/config';
import {
	transformAnswer,
	ShareCore,
	normalShareContent,
} from '../../utils/util';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { que as QueRes } from '../../que';

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

	behaviors: [navBev, ImgBev],
	data: {
		cat_id: CAT.HAPPINESS,
		// 开始
		start: true,
		// 选择答案
		selected: false,
		// 关闭定时器
		close: false,
		// 标题
		title: '中华人民共和国的自由,哪项不符合法律法规？',
		// 选项
		options: ['言论', '示威', '集合', '斗殴'],
		// 激活选项
		activeIndex: null,
		// 结果背景 SUNNY_ERROR_BG, SUNNY_RIGHT_BG
		resultBg: '',
		// 题目
		questions: null,
		// 答案索引
		AnswerIndex: null,
		// 答案解释
		answer: '国家规定示威在国内不是自由的',
		// 选择答案
		selected: false,
		// 准备好开始倒计时
		start: false,
		// 当前题目索引
		currQuIndex: 0,
		// 锁
		selectFlag: false,
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
		// 关闭进度条定时器
		close: false,
		// 错误倒计时
		timer: SUNNY_DOWN_TIME,
		scrollTop: 0,
	},

	async onShow() {
		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.isShare = false;
		}
	},

	onLoad: async function (options) {
		// 动画
		ani = new HappyAnimate(this);
		wx.showLoading();
		console.log(QueRes);
		// 先获取题目
		if (QueRes) {
			const questions = QueRes;
			// todo
			// 本地护盾-1

			questions.forEach(item => {
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
			Store.set('happy_error', QueRes.message || '发生错误');
			wx.navigateBack();
		}
		wx.hideLoading();
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
		let result = index === this.data.AnswerIndex;
		this.setData({
			result: result ? ANSWER_TYPE.RIGHT : ANSWER_TYPE.ERROR,
			resultBg: result
				? ImgSrc.HAPPY_QUESTION_TRUE
				: ImgSrc.HAPPY_QUESTION_WRONG,
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
			// setTimeout(() => {
			// 	this._next();
			// }, 1000);
			this.setData({
				showFlag: true,
			});
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
				// this._startDownTime();
			});
		}
	},

	// 超时
	handleProStop() {
		// 插入错误数组中
		this.data.singleScore.wronglist.push(
			this.data.questions[this.data.currQuIndex].id
		);

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
	},

	// 匹配选项top值
	_matchTop(index) {
		return 100 + '%';
	},

	// 超时，错误.开始倒计时
	_startDownTime() {
		this.downTimer = setInterval(() => {
			if (this.data.timer <= 0) {
				clearInterval(this.downTimer);
				this._next(true);
				return;
			}
			this.setData({
				timer: this.data.timer - 1,
			});
		}, 1000);
	},

	// 关闭弹窗
	handleResultClose() {
		this.setData({
			pop: false,
		});
		wx.navigateBack();
	},

	// 下一题按钮
	handleNext() {
		// 加锁
		if (this.nextFlag) {
			return;
		}
		clearInterval(this.downTimer);
		this._next(true);
		this.nextFlag = true;
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
			console.log(height);
			// 根据tips高度移动
			this.setData({
				scrollTop: height,
			});
		});
	},

	/**
	 * 下一题
	 * @param {any} isError	是否错误模式
	 * @returns {any}
	 */
	async _next(isError) {
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
});
