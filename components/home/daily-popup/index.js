import CDate from '../../../class/date';
import ImgBev from '../../../behaviors/imgBev';
let cd = new CDate();
Component({
	behaviors: [ImgBev],
	/**
	 * 组件的属性列表
	 */
	properties: {
		hidden: Boolean,
		dailyData: Array,
		sign: Boolean,
		count: Number,
		iconCount:Number
	},
	data: {
		date: ['日', '一', '二', '三', '四', '五', '六'],
		activeDay: [],
		thisMonthDays: [],
	},

	observers: {
		dailyData(val) {
			if(val.length>0) {
				this._updateThisMonthDays(this.data.thisMonthDays);
			}
		},
		sign(val) {
			if(val) {
				this._updateThisMonthDays(this.data.thisMonthDays);
			}
		}
	},

	attached() {
		this._loadImgSrc();
		let d = new Date();
		let monthDays = cd.getMonthDaysArray(
			d.getFullYear(),
			d.getMonth() + 1,
			d.getDay()
		);
		this._updateThisMonthDays(monthDays);
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onReceive() {
			if(this.properties.sign) {
				return wx.showToast({
					title: '您今日已签到',
					icon: 'none'
				})
			}
			this.triggerEvent('receive');
		},
		onClose() {
			this.triggerEvent('close');
		},
		// 更新当月的天数，匹配签到天数
		_updateThisMonthDays(monthDays) {
			monthDays.forEach(day => {
				this.properties.dailyData.forEach(acday => {
					if (day.dayNum === acday) {
						day.ac = true;
					}
				});
			});
			this.setData({
				thisMonthDays: monthDays,
			});
		}
	},
});
