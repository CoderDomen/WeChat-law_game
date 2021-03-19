import { ANSWER_TYPE } from '../../../config/config';
import ImgBev from '../../../behaviors/imgBev';
import FolkAnimate from '../../../animatie/folk';
import { GAME_MODE, DOWN_TIME } from '../../../config/config';

let folkAni = null;

Component({
	behaviors: [ImgBev],
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 问题
		question: Object,
		// 当前答题数
		count: Number,
		// 总答题数
		tatal: Number,
		// 双方分数
		score: Object,
		// 关闭当前页面, 用于清理定时器
		close: Boolean,
		// 对方信息
		enemyName: String,
		enemyAvatar: String,
		// 类型	random or friend
		type: String,
		// 好友对战清楚定时器
		next: Boolean
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		question_title: '中国人民共和共公民的自由,哪项不符合法律法规?',
		question_options: ['言论', '示威', '集会', '斗殴'],
		result: '',
		// 问题答案的索引值
		AnswerIndex: 0,
		// 选择的答案索引
		activeIndex: null,
		// 题目选择锁
		selectFlag: false,
		// 是不是第一道题
		first: true,
		// 用来控制进度条状态
		selected: false,
		// 倒计时时间
		downTime: DOWN_TIME,
		// 获取倒计时时间
		getProgressTime: false,
	},

	observers: {
		next(val) {
			if(val && this.properties.type === GAME_MODE.FRIEND) {
				// 定制计时器
				this.setData({
					selected: true
				});
			}
		},
		question(val) {
			// 没有题目的情况
			if (!val) {
				return;
			}

			if (this.data.first) {
				this.data.first = false;
				// 格式化问题
				this._formatQuestion();
				folkAni._firstAnimation();
			} else {
				folkAni._nextAnimation(() => {
					this.triggerEvent('customAnimationEnd')
				});
			}
		},
	},

	created() {
		folkAni = new FolkAnimate(this);
	},

	attached() {
		this._loadImgSrc();
		console.log(this.properties.myAvatar, this.properties.myName, 'my');
		console.log(
			this.properties.enemyAvatar,
			this.properties.enemyName,
			'enemy'
		);
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 对方头像获取失败
		onEnemyAvatarErr() {
			this.setData({
				enemyAvatar: '',
			});
		},

		// 进度条时间被动停止（用户作答）
		handleProgressStop(e) {
			if(this.data.randomSelect && this.properties.type === GAME_MODE.FRIEND) {
				return;
			}
			const { time } = e.detail;
			this.triggerEvent('answered', {
				time,
				result: this.data.result === ANSWER_TYPE.RIGHT ? 10 : 0,
			});
		},

		// 获取进度条倒计时时间
		handleProgressTime(e) {
			if (this.properties.type === GAME_MODE.RANDOM) {
				this.setData({
					selected: true,
				});
				// let { time } = e.detail;
				// let flag = time > 3 ? true : false;
				// time = Math.random() * time;
				// time = flag && Math.random() < 0.5 ? Math.min(0, time) : Math.max(0, time);
				// setTimeout(() => {
				// 	this.setData({
				// 		selected: true,
				// 	});
				// }, time * 1000);
			}
		},

		// 进度条主动停止(即时间到)
		handleProgressEnd() {
			this._lock();
			// 广播事件
			this.triggerEvent('timeout');
			if(!this.data.randomSelect) {
				wx.showToast({
					title: '时间到',
					icon: 'none',
				});
			}
		},
		// 处理答案
		handleAnswer(e) {
			if (this._isLock()) {
				// 已上锁
				return;
			}
			this._lock();
			const index = e.target.dataset.a;
			const result =
				index === this.data.AnswerIndex ? ANSWER_TYPE.RIGHT : ANSWER_TYPE.ERROR;
			if (this.properties.type === GAME_MODE.FRIEND) {
				this.setData({
					activeIndex: index,
					result,
					randomSelect: true
				});
				this.triggerEvent('answered', {
					result: this.data.result === ANSWER_TYPE.RIGHT ? 10 : 0,
				});
			} 
			if (this.properties.type === GAME_MODE.RANDOM) {
				this.setData({
					activeIndex: index,
					getProgressTime: true,
					result,
					randomSelect: true
				});
			}
		},

		// 格式化问题数据
		_formatQuestion() {
			const keys = Object.keys(this.properties.question);
			let queObj = {
				title: '',
				options: [],
				AnswerIndex: null,
			};
			if (keys.length) {
				keys.forEach(key => {
					if (key.includes('que')) {
						queObj.title = this.properties.question[key];
					}
					if (key.includes('opt')) {
						queObj.options.push(this.properties.question[key]);
					}
					if (key.includes('ans')) {
						queObj.AnswerIndex = this.properties.question[key];
					}
				});
			}
			this.setData({
				question_title: queObj.title,
				question_options: queObj.options,
				AnswerIndex: queObj.AnswerIndex,
			});
		},

		// 重置绑定参数
		_reback() {
			this.setData({
				activeIndex: null,
				result: '',
				selected: false,
				randomSelect: false
			});
		},

		// 是否上锁
		_isLock() {
			return this.data.selectFlag;
		},
		// 上锁
		_lock() {
			this.data.selectFlag = true;
		},
		_unlock() {
			setTimeout(() => {
				this.data.selectFlag = false;
			}, 100)
		},
	},
});
