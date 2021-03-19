import {
	TRAIN_STATUS,
	IDENTIFY,
	ANSWER_STATUS,
	GAME_MODE,
} from '../../../config/config';
import AnswerModel from '../../../model/answerModel';
import UserModel from '../../../model/userModel';
import Store from '../../../model/storeModel';

// 回答模型
const am = new AnswerModel();
// 用户模型
const um = new UserModel();

// 轮训间隔时间 ms
const TRAIN_TIME = 1000;
// 答题阈值
const MAX_SCORE = 9999;

export default {
	// 时间到，我方未作答
	async handleTimeOut() {
		const result = this.data.localScore + 0;

		let qaNum = this.data.currQuIndex + 1;
		this.data.localScore = result;
		
		await this._updateQaNum(qaNum, this._isEnd())
	},

	// 监听作答情况
	async handleAnswered(e) {
		let { result } = e.detail;
		// 对分数进行累加
		result += this.data.localScore;
		let qaNum = this.data.currQuIndex + 1;
		this.data.localScore = result;

		await this._updateQaNum(qaNum, this._isEnd())
	},
	// 加入房间
	_handleJoinRoomRes(res) {
		// 对方
		console.log(res);
		const { msg, successed } = res;
		this._hideLoading();
		if (!successed) {
			this._handleRoomExpire(msg);
		} else {
			const { question } = res;

			console.log('获取问题');
			console.log(question);

			// 玩命加载逻辑中，对答题前初始化, 并设置题目
			this.setData({
				readyPlay: true,
				questions: this._formatQue(question),
			});
			setTimeout(() => {
				this.setData({
					frighting: true,
				});
				// 也要开始轮训
				this.startTrain();
			}, 1500);
		}
	},

	// 正常按钮加入房间
	async notOpenTypeJoinRoom() {
		// 判断护盾是否足够
		const { shield } = Store.get('user');
		if (shield <= 0) {
			return wx.showToast({
				title: '护盾已用完',
				icon: 'none',
			});
		}
		this._showLoading('正在进入房间');
		let uid = UserModel.hasUid();
		console.log('正常加入房间', uid);
		// 加入房间
		let JoinRoomRes = await am.joinRoom(uid, this.data.roomId);
		this._handleJoinRoomRes(JoinRoomRes);
	},

	// open-type按钮加入房间
	async hadOpenTypeJoinRoom(res) {
		// 判断护盾是否足够
		const { shield } = Store.get('user');
		if (shield <= 0) {
			return wx.showToast({
				title: '护盾已用完',
				icon: 'none',
			});
		}

		this._showLoading('正在进入房间');
		console.log('有open-type');
		const { userInfo } = res.detail;
		let uid = UserModel.hasUid();
		UserModel.setUserInfo(userInfo);
		userInfo.userId = uid;
		let updateRes = await um.updateInfo(userInfo);
		if (updateRes.data.successed) {
			Reflect.deleteProperty(userInfo, 'userId');
			UserModel.setUserInfo(userInfo);
			// 加入房间
			let JoinRoomRes = await am.joinRoom(uid, this.data.roomId);
			this._handleJoinRoomRes(JoinRoomRes);
		} else {
			wx.showToast({
				title: updateRes.data.msg,
				icon: 'none',
				mask: true,
			});
		}
	},

	// 游戏类型：好友对战
	async _friendGame() {
		if (this.data.ID_status === IDENTIFY.SELF) {
			// 自己逻辑
			console.log('好友对战');
			console.log('创建房间');
			console.log('开始轮训');
			// 创建房间
			await this._createRoom();
			// 开始轮训
			this.startTrain(true);
		}
		if (this.data.ID_status === IDENTIFY.FRIEND) {
			const self = this;
			self._showLoading();
			console.log('好友逻辑');
			self.setData({
				enemyAvatarUrl: this.data.enemyAvatarUrl,
				enemyName: this.data.enemyName,
			});
			// 没有授权过的情况，是否显示open-data按钮
			wx.getUserInfo({
				lang: 'zh_CN',
				async success(res) {
					let { userInfo } = res;
					// 更新用户信息
					userInfo.userId = UserModel.hasUid();
					let updateRes = await um.updateInfo(userInfo);
					if (updateRes.data.successed) {
						Reflect.deleteProperty(userInfo, 'userId');
						UserModel.setUserInfo(userInfo);
					}
					self._hideLoading();
				},
				async fail() {
					console.log('fail');
					self.setData({
						openType: true,
					});
					self._hideLoading();
				},
			});
		}
	},

	// 开始轮询
	startTrain(isShowUserInfo = false) {
		this.data.trainTimer = setInterval(async () => {
			let roomStatusRes = await am.checkRoomStatus(
				UserModel.hasUid(),
				this.data.roomId,
				isShowUserInfo
			);
			if (!roomStatusRes.successed) {
				wx.showToast({
					title: '发生错误',
					icon: 'none',
				});
				return;
			}
			switch (roomStatusRes.status) {
				case TRAIN_STATUS.WAIT:
					console.log('等待对方加入');
					break;
				case TRAIN_STATUS.START:
					this._handleRoomStart(roomStatusRes);
					break;
				case TRAIN_STATUS.EXPIRE:
					this._handleRoomExpire('房间已过期', true);
					break;
				default:
					break;
			}
		}, TRAIN_TIME);
	},

	// 继续游戏
	handleContinue() {
		wx.navigateBack();
		// // todo
		// this._reback();
		// // 创建房间开启等待
		// this._friendGame();
	},

	// frighting 切换动画结束后
	handleAnimationEnd() {
		this.data.next = false;
	},

	// 开始或者正在答题
	async _handleRoomStart(res) {
		if (this.data.frighting) {
			this._handleScore(res);

			if (res.isUser1Finish && res.isUser2Finish) {
				console.log('完成答题');
				console.log(res);

				const isWin = this._canIwin(true, res);
				// const isWin = res.

				// 本地护盾-1
				let { shield, coin } = Store.get('user');
				UserModel.updateCacheUser('shield', shield - 1);
				if (isWin) {
					UserModel.updateCacheUser('coin', coin + this.data.Win_coin);
				}

				// 都已经完成, 则停止轮序
				this._showTips('答题结束');
				this._stopTrain();
				// 结算分数
				this.setData({
					result: this._canIwin(res),
					selectResult: '',
					isEnd: true,
					close: true
				});
				return;
			}

			// 提前结束
			if(this.data.ID_status === IDENTIFY.SELF && res.user2_qaNum === -1) {
				// user1， 提交isFinish
				await this._updateQaNum(this.data.currQuIndex + 1, true, true);

			} else if (this.data.ID_status === IDENTIFY.FRIEND && res.user2_qaNum === -1) {
				// user2， 提交isFinish
				await this._updateQaNum(this.data.currQuIndex + 1, true, true);
			}
			

			if (
				res.user1_qaNum &&
				res.user1_qaNum === this.data.currQuIndex + 1 &&
				this.mystatus === null
			) {
				this.mystatus = ANSWER_STATUS.ANSWERED;
			}

			if (
				res.user2_qaNum &&
				res.user2_qaNum === this.data.currQuIndex + 1 &&
				this.opstatus === null
			) {
				this.opstatus = ANSWER_STATUS.ANSWERED;
			}

			if (!this._isEnd()) {
				const { opstatus, mystatus } = this;
				if (
					mystatus === ANSWER_STATUS.ANSWERED &&
					opstatus === ANSWER_STATUS.ANSWERED
				) {
					if (!this.data.next) {
						this.setData({
							next: true,
						});
						setTimeout(() => {
							console.log('下一题');
							// 进入下一题
							this.setData({
								currQuIndex: ++this.data.currQuIndex,
							});
							this.mystatus = null;
							this.opstatus = null;
						}, 1000);
					}
				}
			}
		} else {
			// 我方 开始前
			// 准备进入答题页面
			console.log(res, '开始答题啦啦啦啦');
			if (res.user2Info.userName && res.user2Info.headUrl) {
				// 停止轮询， 进入答题
				this._stopTrain();
				// 玩命加载逻辑中，对答题前初始化
				this.setData({
					enemyName: res.user2Info.userName,
					enemyAvatarUrl: res.user2Info.headUrl,
					readyPlay: true,
					questions: this._formatQue(this.data.questions),
				});
				setTimeout(() => {
					this.setData({
						frighting: true,
					});
					// 开始轮询
					this.startTrain();
				}, 1500);
			}
		}
	},

	// 更新得分信息
	_handleScore(res) {
		if (this.data.ID_status === IDENTIFY.SELF) {
			this.data.score.my.time = res.user1_finish_time;
			this.data.score.my.result = 
				res.user1score > MAX_SCORE - 1 ? this.data.score.my.result : res.user1score;
			this.data.score.enemy.time = res.user2_finish_time;
			this.data.score.enemy.result = res.user2score;
		}
		if (this.data.ID_status === IDENTIFY.FRIEND) {
			this.data.score.my.time = res.user2_finish_time;
			this.data.score.my.result = 
				res.user2score > MAX_SCORE - 1 ? this.data.score.my.result : res.user2score;
			this.data.score.enemy.time = res.user1_finish_time;
			this.data.score.enemy.result = res.user1score;
		}

		this._updateScore();
	},

	// 处理房间过期， 加入房间失败问题
	_handleRoomExpire(title, isStopTrain) {
		isStopTrain && this._stopTrain();
		wx.showModal({
			content: title,
			showCancel: false,
			success: res => {
				console.log('停止轮询');
				if (res.confirm) {
					wx.navigateBack();
				}
			},
		});
	},

	// 停止轮询
	_stopTrain() {
		clearInterval(this.data.trainTimer);
	},

	// 创建房间
	async _createRoom() {
		let uid = this._getUid();
		// 答题类型
		let { catid } = this.data;
		// 创建房间
		let { successed, room_id, question } = await am.createRoom(uid, catid);
		console.log('创建房间');
		console.log(question);
		console.log(successed, room_id, question, '创建房间');
		if (successed) {
			this.data.roomId = room_id;
			this.data.questions = question;
		} else {
			this._showTips('创建房间失败');
		}
	},

	// 更新接口上的qaNum
	// midleave 是不是中途离开的情况
	async _updateQaNum(qaNum, isEnd, midleave = false) {
		const score = midleave ? this.data.localScore + MAX_SCORE : this.data.localScore;
		let updateRes = await am.uploadAnswer(
			UserModel.hasUid(),
			this.data.roomId,
			score,
			qaNum,
			isEnd
		);
		if (!updateRes.successed) {
			wx.showToast({
				title: '提交结果发生错误',
				icon: 'none',
			});
		}
		if (isEnd && updateRes.coin) {
			this.setData({
				Win_coin: updateRes.coin,
			});
		}
	},

	// 	// 重置参数
	// _reback() {
	// 	this.setData({
	// 		// 获胜奖励的金币数量
	// 		Win_coin: 0,
	// 		// 是否准备好开始
	// 		readyPlay: false,
	// 		// 对手头像
	// 		enemyAvatarUrl: '',
	// 		// 对手昵称
	// 		enemyName: '',
	// 		// frighting组件开关
	// 		frighting: false, // false
	// 		// 最终结果
	// 		result: '',
	// 		// 分享组件开关
	// 		share: false,
	// 		// 当前题目索引
	// 		currQuIndex: 0,
	// 		// 题目信息
	// 		questions: [],
	// 		// 答题正确数目
	// 		rightCount: 0,
	// 		// 进入下一题的开关
	// 		nextFlag: false,
	// 		// 选择的答案
	// 		selectResult: '',
	// 		// 是否结束
	// 		isEnd: false,
	// 		// 双方分数
	// 		score: JSON.parse(initScore),
	// 		// 用户点击导航栏返回按钮时变为true, 监听其操作清理定时器
	// 		close: false,
	// 		// 房间号
	// 		roomId: 0,
	// 		// 双人对战结束标识
	// 		friendFrightEnd: false,
	// 		// 本地成绩库
	// 		localScore: 0,
	// 		// 单人答题的成绩管理
	// 		singleScore: {
	// 			// 错误题目的id号
	// 			wronglist: [],
	// 			// 正确题目的id号
	// 			rightlist: [],
	// 		},
	// 		// 自定义modal开关
	// 		modal: false,
	// 		// randomSelect随机挑战记录的开关
	// 		randomSelect: false,
	// 		// 进入下一题，控制停止进度条
	// 		next: false
	// 	})
	// },
};
