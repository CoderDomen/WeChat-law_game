import ImgBev from '../../../behaviors/imgBev';

Component({
	behaviors: [ImgBev],
	properties: {
		title: String,
		shield: Number,
		coin: Number
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onReceive() {
			this.triggerEvent('receive');
		},
		onClose() {
			this.triggerEvent('close');
		},
	},
});
