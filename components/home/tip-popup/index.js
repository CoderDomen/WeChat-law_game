import ImgRes from '../../../config/imgSrc';
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		ImgRes: null
	},

	attached() {
		if(ImgRes) {
			this.setData({
				ImgRes
			})
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onClose() {
			this.triggerEvent('close');
		},
	},
});
