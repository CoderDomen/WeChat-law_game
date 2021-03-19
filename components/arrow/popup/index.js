import ImgBev from '../../../behaviors/imgBev';

Component({
	behaviors: [ImgBev],
	/**
	 * 组件的属性列表
	 */
	properties: {
		hidden: Boolean,
		answtype: {
			type: Number,
			value: 1,
		},
		// 答案解释
		explain: String,
		// 答案内容
		answerCotent: String,
		isDisabled: Boolean,
	},

	observers: {
		hidden(val) {
			if (!val) {
				this.setData({
					random: +new Date(),
				});
			}
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		random: null,
		msg:
			'法律效益是指通过立法、执法、诉讼、守法过程中对法律权利资源的最优配置，使用价值在质上的极优化程度和量上的极大化程度及其所得到的综合效果。用公式表示为：法律效益=法律收益-法律成本。',
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		sendNext(){
			this.triggerEvent('handleNext')
		},
		closetip(){
			this.setData({
				hidden:true
			});
		}
	},
});
