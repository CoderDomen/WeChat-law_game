import QuestionModel from '../../../model/questionModel';
import { DOWN_TIME, FOLK_RANDOM_TIME } from '../../../config/config';
import { initScore } from './public';
import AnswerModel from '../../../model/answerModel';
import UserModel from '../../../model/userModel';
import Store from '../../../model/storeModel';

// 问题模型
const qm = new QuestionModel();
const am = new AnswerModel();

// 随机模块
export default {
	// 监听作答情况
	async handleAnswered(e) {
		this._settleQue(e.detail);
		this._nextQue();
	},
	// 时间到，我方未作答
	async handleTimeOut() {
		this._settleQue();
		this._nextQue();
	},
	// 继续游戏,重新开始游戏, 返回到随机匹配阶段，目前只适合随机模式
	async handleContinue() {
		wx.navigateBack();
		// 重置绑定参数
		// this.setData({
		// 	// 倒计时
		// 	time: FOLK_RANDOM_TIME,
		// 	// 是否准备好开始
		// 	readyPlay: false,
		// 	// 匹配到随机对手
		// 	getEnemy: false,
		// 	// 对手昵称
		// 	enemyName: '',
		// 	// frighting组件开关
		// 	frighting: false, // false
		// 	// 最终结果
		// 	result: '',
		// 	// 分享组件开关
		// 	share: false,
		// 	// 当前题目索引
		// 	currQuIndex: 0,
		// 	// 题目信息
		// 	questions: [],
		// 	// 答题正确数目
		// 	rightCount: 0,
		// 	// 进入下一题的开关
		// 	nextFlag: false,
		// 	// 选择的答案
		// 	selectResult: '',
		// 	// 是否结束
		// 	isEnd: false,
		// 	// 双方分数
		// 	score: JSON.parse(initScore),
		// });
		// this._matchGameMode(this.data.type);
	},

	// 游戏类型：随机
	async _randomGame() {
		// 获取题目
		wx.showLoading({
			title: '正在加载',
		});
		const questions = await this._getQue();
		this.setData({
			questions,
		});
		wx.hideLoading();

		this.data.timerInter = setInterval(() => {
			// 倒计时， 模拟正在匹配对手，从time（15s）开始
			this.setData({
				time: --this.data.time,
			});
		}, 1000);

		// 模拟匹配对手的时间
		const getEnemyTime = parseInt(
			parseInt(Math.random() * FOLK_RANDOM_TIME) * Math.random()
		);

		setTimeout(() => {
			// 匹配对手成功
			clearInterval(this.data.timerInter);
			this.setData({
				readyPlay: true,
				getEnemy: true,
			});
			// 延迟进入答题场景
			setTimeout(() => {
				this.setData({
					frighting: true,
				});
			}, 1500);
		}, getEnemyTime * 1000);
	},

	// 获取题目并调整其数据结构
	async _getQue() {
		let uid = this._getUid();
		// 答题类型
		let { catid } = this.data;
		// 获取题目信息, 难度默认是等级一
		let { data: questions, head_url = '', user_name, message } = await qm.get(
			uid,
			catid
		);
		if (questions && questions.length === 0) {
			Store.set('error', message);
			wx.navigateBack();
			return;
		}
		// 判断是否游客用户的头像
		head_url = head_url.includes('https') ? head_url : '';
		this.setData({
			enemyName: user_name || '柠檬酱',
			enemyAvatarUrl:  head_url,
		});
		// 本地护盾-1
		let { shield } = Store.get('user');
		UserModel.updateCacheUser('shield', shield - 1);
		return this._formatQue(questions);
	},

	// 下一题
	_nextQue(time = 2000) {
		// TIME, 定时器时间
		setTimeout(async () => {
			// 进入下一题
			// 判断是否已经是最后一道题
			if (this._isEnd()) {
				// 上传分数接口
				wx.showLoading();
				let uploadRes = await am.uploadAnswerBySingle({
					uid: UserModel.hasUid(),
					wronglist: this.data.singleScore.wronglist,
					rightlist: this.data.singleScore.rightlist,
					cat_id: this.data.catid,
					isWin: this._canIwin(true),
					suiji: true
				});
				if (uploadRes.successed) {
					wx.hideLoading();
					if (this._canIwin()) {
						let elseInfo = Store.get('user');
						let coin_num = uploadRes.coin || 0;
						UserModel.updateCacheUser('coin', elseInfo.coin + coin_num);
					}
					this.setData({
						result: this._canIwin(),
						selectResult: '',
						isEnd: true,
						Win_coin: uploadRes.coin,
					});
				} else {
					wx.showToast({
						title: '发生错误',
						icon: 'none',
					});
				}
			} else {
				this.setData({
					currQuIndex: ++this.data.currQuIndex,
				});
			}
		}, time);
	},

	// 对该题目进行结算
	_settleQue(detail = { time: DOWN_TIME, result: 0 }) {
		// 获取敌方用时和结果
		const {
			time: enemyTime,
			result: enemyResult,
		} = this._generateEnemyResult();
		// 我方用时和结果
		const { time: myTime, result: myResult } = detail;
		// 记录该题目的id号，并分类号
		this._recordId(myResult);
		this._addScoreNTime('my', myResult, myTime);
		this._addScoreNTime('enemy', enemyResult, enemyTime);
		this._updateScore();
	},

	// 生成对手的用时和选择结果
	// 忽略超时不选的情况
	_generateEnemyResult() {
		// 用时
		let time = DOWN_TIME - parseInt(Math.random() * DOWN_TIME);
		time = time === 0 ? time + 1 : time;
		// 结果
		let answer = DOWN_TIME - parseInt(Math.random() * DOWN_TIME);
		answer = answer >= time ? true : false;
		return {
			time,
			result: answer ? 10 : 0,
		};
	},
	// 追加双方分数和统计用时, 'my' , 'enemy'
	_addScoreNTime(type, result, time) {
		this.data.score[type].result += result;
		this.data.score[type].time += time;
	},
	// 记录id result boolean
	_recordId(result) {
		const que = this.data.questions[this.data.currQuIndex];
		if (result) {
			this.data.singleScore.rightlist.push(que.id);
		} else {
			this.data.singleScore.wronglist.push(que.id);
		}
	},
};
