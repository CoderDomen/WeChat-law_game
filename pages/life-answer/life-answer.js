import { ANSWER_TYPE } from '../../config/config';
import navBev from '../../behaviors/behavior';
import gameBev from '../../behaviors/game';
import ImgRes from '../../config/imgSrc';
import { transformAnswer } from '../../utils/util';
const OPTION_BG = {
	RIGHT: ImgRes.ARROW_SUBJECT_RIGHT_BG,
	WRONG: ImgRes.ARROW_SUBJECT_WRONG_BG,
};
import { CAT } from '../../config/config';
import UserModel from '../../model/userModel';
import QuestionModel from '../../model/questionModel';
import Store from '../../model/storeModel';
import AnswerModel from '../../model/answerModel';

const am = new AnswerModel();

let qm = new QuestionModel();

Page({
	behaviors: [navBev, gameBev],
	// properties: {
	// 	// 问题
	// 	question: Object,
	// 	// 当前答题数
	// 	count: Number,
	// 	// 总答题数
	// 	tatal: Number,
	// },

	/**
	 * 组件的初始数据
	 */
	data: {
		catid: CAT.FOLK,
		photo: {
			boy: ImgRes.ARROW_SUBJECT_BOY,
			girl: ImgRes.ARROW_SUBJECT_GIRL,
			gu: ImgRes.ARROW_SUBJECT_DRUM,
		},
		questions: [],
		question_title: '中华人民共和国公民的自由，哪项不符合法律条规？',
		question_options: ['言论', '示威', '集合', '斗殴'],
		// 问题答案的索引值
		AnswerIndex: 0,
		activeIndex: null,
		result: '',
		resultBg: '',
		answerBg: '',
		first: true,
		selectFlag: false,
		pageBg: ImgRes.ARROW_RANK_BG,
		tatal: 0,
		count: 0,
		currQuIndex: 0,
		singleScore: {
			// 错误题目的id号
			wronglist: [],
			// 正确题目的id号
			rightlist: [],
		},
		rightCount: 0,
	},

	// observers: {
	// 	question(val) {
	// 		// 没有题目的情况
	// 		if (!val) {
	// 			return;
	// 		}
	// 		if (this.data.first) {
	// 			// 第一道题目没动画
	// 			this.data.first = false;
	// 			// 格式化问题
	// 			this._formatQuestion();
	// 			this._firstAnimation();
	// 		} else {
	// 			this._nextAnimation();
	// 		}
	// 	},
	// },

	async onLoad() {
		await this.getQuestions();
	},

	// 获取问题
	async getQuestions() {
		wx.showLoading({
			title: '加载中',
			mask: true,
		});
		let uid = this._getUid();
		// 答题类型， 当前的难度等级
		let { catid } = this.data;
		// 获取题目信息
		let { data: questions, message } = await qm.get(uid, catid);
		if (questions) {
			if (questions.length > 0) {
				// 本地护盾-1
				let { shield } = Store.get('user');
				UserModel.updateCacheUser('shield', shield - 1);
				questions.forEach(item => {
					item.ans = transformAnswer(item.ans);
				});
				this.setData({
					questions,
					tatal: questions.length,
					count: 1,
					currQuIndex: 0,
					nextque:false
				});
				this._formatQuestion();
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

	// 选择答案
	onSelect(e) {
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
			resultBg: result ? OPTION_BG.RIGHT : OPTION_BG.WRONG,
			answerBg: OPTION_BG.RIGHT,
			activeIndex: index,
		});
		this.handleSelect(this.data.result);
	},

	// 答案选择
	handleSelect(result) {
		this._recordId(result);
		// 计算答对的题目数目
		if (result === ANSWER_TYPE.RIGHT) {
			// 答对了
			this.setData({
				rightCount: this.data.rightCount + 1,
			nextque:true
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
			setTimeout(() => {
				this.data.nextFlag = true;
			}, 500);
		}, 1000);
		}
	},

	// 结果组件返回
	handleBack() {
		console.log(this.data.rightCount);
		  const currentanswerlevel=wx.getStorageSync('currentanswerlevel');
			const pass=wx.getStorageSync('pass');
			const uuid=wx.getStorageSync('uid');
			const stage=wx.getStorageSync('stage');
			wx.request({
				url: this.data.baseurl+"/qcrsPassCallback",
				method: 'POST',
				data:{
					uid:uuid,
					stage:stage,
					pass:currentanswerlevel,
				},
				success: (res) => {
					wx.setStorage({
						data: res.data.data.stage,
						key: 'stage',
					}) ;
					wx.setStorage({
						data: res.data.data.pass,
						key: 'pass',
					}) ;
				},
		
			})
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1];   //当前页面
			var prevPage = pages[pages.length - 2];  //上一个页面
			
			//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
			
			//不需要页面更新
			prevPage.setData({
				shareshow: true
			})
		
		wx.navigateBack();
	},

	// 进入下一题
	async handleNext() {
		
		if (!this.data.nextFlag) {
			return;
		}
		this.setData({
			nextque:false
		})
		// 进入下一题
		// 判断是否已经是最后一道题
		if (this._isEnd()) {
			// 上传分数

			// 上传分数接口
			wx.showLoading();
			const pass=wx.getStorageSync('pass');
		
			const currentanswerlevel=wx.getStorageSync('currentanswerlevel');
		const stage2=wx.getStorageSync('stage2');
			let uploadRes = await am.uploadAnswerBySingle({
				uid: UserModel.hasUid(),
				wronglist: this.data.singleScore.wronglist,
				rightlist: this.data.singleScore.rightlist,
				cat_id: 5,
				pass:currentanswerlevel,
				stage:stage2
			});
			
			if (uploadRes.successed) {
				wx.showToast({
					title: uploadRes.msg,
					icon: 'none',
				});
					wx.setStorage({
					data: uploadRes.data.stage,
					key: 'stage',
				}) ;
				wx.setStorage({
					data: uploadRes.data.pass,
					key: 'pass',
				}) ;
				this.setData({
					resultType: this._canIpass(uploadRes.pass),
					selectResult: '',
					isEnd: true,
					win_coin: uploadRes.coin,
				});
			} else {
				wx.showToast({
					title: '闯关失败！',
					icon: 'none',
				});
				this.setData({
					resultType: 1,
					selectResult: '',
					isEnd: true,
				});
			}
		} else {
			this._pageReback();
			this.setData({
				currQuIndex: this.data.currQuIndex + 1,
				count: this.data.count + 1,
			});
			this._nextAnimation();
		}
	},

	// 恢复设置
	_pageReback() {
		this.setData({
			selectResult: '',
			answerType: 0,
			explain: '',
			field: null,
		});
	},

	// 判断闯关结果
	_canIpass(pass, useBool) {
		let result = -1;
		if (pass) {
			result = 0;
		}
		if (useBool) {
			return result === 0 ? true : false;
		}
		return result;
	},

	// 格式化问题数据
	_formatQuestion() {
		const question = this.data.questions[this.data.currQuIndex];
		let pam = {};
		for(let i in question){
			if(question[i]){
				pam[i] = question[i]
			}
		};
		// const keys = Object.keys(question);
		const keys = Object.keys(pam);
		let queObj = {
			title: '',
			options: [],
			AnswerIndex: null,
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
			});
		}
		this.setData({
			question_title: queObj.title,
			question_options: queObj.options,
			AnswerIndex: queObj.AnswerIndex,
		});
	},

	_isEnd() {
		// 这里 +1 是因为上面，需要在答题数目自增前，判断是否已经答题完毕。
		// 此时的 currQuIndex 还是旧的index
		return this.data.currQuIndex + 1 >= this.data.questions.length;
	},

	// 恢复初始值
	_reback() {
		this.setData({
			selectFlag: false,
			result: '',
			resultBg: '',
			answerBg: '',
			activeIndex: null,
		});
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

	// 第一题动画
	_firstAnimation() {
		this.animate(
			'#pannel',
			[
				{ translate3d: ['110%', 0, 0], offset: 0 },
				{ translate3d: ['0%', 0, 0], offset: 1 },
			],
			300,
			() => {
				this.clearAnimation('#pannel', () => {
					console.log('animaiton clear end');
				});
			}
		);
	},
	// 下一题动画
	_nextAnimation() {
		this.animate(
			'#pannel',
			[
				{ translate3d: ['0%', 0, 0], offset: 0 },
				{ translate3d: ['-110%', 0, 0], offset: 1 },
			],
			300,
			() => {
				// 绑定参数重置
				this._reback();
				// 格式化问题
				this._formatQuestion();
				this.animate(
					'#pannel',
					[
						{ translate3d: ['100%', 0, 0], offset: 0 },
						{ translate3d: ['0%', 0, 0], offset: 1 },
					],
					300,
					() => {
						this.clearAnimation('#pannel');
					}
				);
			}
		);
	},
});
