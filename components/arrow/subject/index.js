import { ANSWER_TYPE } from '../../../config/config';
import ImgRes from '../../../config/imgSrc';
import UserModel from '../../../model/userModel';

const OPTION_BG = {
	RIGHT: ImgRes.ARROW_SUBJECT_RIGHT_BG,
	WRONG: ImgRes.ARROW_SUBJECT_WRONG_BG,
};

Component({
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
		// 头衔
		rankTitle: String,
		gjSex: Number,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		photo: {
			boy: ImgRes.ARROW_SUBJECT_BOY,
			girl: ImgRes.ARROW_SUBJECT_GIRL,
			gu: ImgRes.ARROW_SUBJECT_DRUM,
		},
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
		sexType: null
	},

	observers: {
		question(val) {
			// 没有题目的情况
			if (!val) {
				return;
			}
			if (this.data.first) {
				// 第一道题目没动画
				this.data.first = false;
				// 格式化问题
				this._formatQuestion();
				this._firstAnimation();
			} else {
				this._nextAnimation();
			}
		},
	},

	attached() {
		const gjSex=this.properties.gjSex;
		this.setData({
			// sexType: UserModel.getGameSexInfo()
			sexType: gjSex
		})
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
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
			this.triggerEvent('select', {
				result: this.data.result,
			});
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
		}

	},
});
