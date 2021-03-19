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
import EV from '../../class/event';
import { Shield } from '../../utils/assist';

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
		catid: CAT.HAPPINESS,
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
		// 滑动距离
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
		console.log(options);
		// 先获取题目
		let QueRes = await qm.get(UserModel.hasUid(), CAT.HAPPINESS);
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
			Store.set('happy_error', QueRes.message || '获取题目失败');
			wx.navigateBack();
		}
		wx.hideLoading();
	},

	onUnload() {
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
		this.setData({
			result: result ? ANSWER_TYPE.RIGHT : ANSWER_TYPE.ERROR,
			resultBg: result
				? ImgSrc.HAPPY_QUESTION_TRUE
				: ImgSrc.HAPPY_QUESTION_WRONG,
			activeIndex: index,
			selected: true,
			showFlag: true,
		});
		console.log(this.data.result);
		console.log(ANSWER_TYPE.RIGHT);
		// 正确
		if (this.data.result === ANSWER_TYPE.RIGHT) {
			// 插入正确数组中
			this.data.singleScore.rightlist.push(
				this.data.questions[this.data.currQuIndex].id
			);
			setTimeout(() => {
				this._next();
			}, 1000);
		}
		// 错误
		if (this.data.result === ANSWER_TYPE.ERROR) {
			// 根据tips高度移动

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

	// 匹配选项top值
	_matchTop(index) {
		return 100 + '%';
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
	// 关闭错误提示
	closetip(){
		this.setData({
			showFlag: false,
			shownext:true,
		});
	},
	// 关闭弹窗
	handleResultClose() {
		wx.redirectTo({   
      url:"/pages/happy-home/happy-home"
   });
		this.setData({
			pop: false,
		});
		if (Shield() <= 0) {
			return wx.showToast({
				title: '护盾已用完',
				icon: 'none',
			});
		}
		// wx.navigateTo({
		// 	url: '/pages/happy-answer/happy-answer',
		// });
		// wx.navigateBack();
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
			});

			// 判断结果
			if (updateRes.successed) {
				console.log(updateRes.msg);
				clearInterval(this.downTimer);
				this.setData({
					isDisabled: true,
				});
				wx.showToast({
					title: updateRes.msg,
					icon: 'none',
				});
				if (updateRes.mcsl) {
					// 更新缓存
					let mcsl = UserModel.getCacheUser('mcsl');
					UserModel.updateCacheUser('mcsl', mcsl + updateRes.mcsl);
					EV.emit('mcsl');
					// 通关成功
					this.setData({
						pop: true,
						pass: PASS_RESULT.SUCCESS,
					});
				} else {
					// 通关失败
					this.setData({
						pop: true,
						pass: PASS_RESULT.FAIL,
					});
				}
			}

			// wx.showToast({
			// 	title: '答题结束',
			// 	icon: 'none',
			// });
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
