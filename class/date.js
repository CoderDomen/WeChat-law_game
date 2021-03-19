class CDate {
	WEEKTABLE = {
		common: {
			cn: [
				'星期日',
				'星期一',
				'星期二',
				'星期三',
				'星期四',
				'星期五',
				'星期六',
			],
			cns: ['日', '一', '二', '三', '四', '五', '六'],
			en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		},
	};

	constructor() {}

	/**
	 * 获取月份天数
	 * @param {number|string} year
	 * @param {number|string} month
	 * @returns {number}
	 */
	getMonthDays(year, month) {
		return new Date(year, month, 0).getDate();
	}

	/**
	 * 获取星期几
	 * @param {number|string} year
	 * @param {number|string} month
	 * @param {number|string} day
	 * @returns {number}
	 */
	getWeekday(year, month, day) {
		return new Date(year, month - 1, day).getDay();
	}

	/**
	 * 获取月份有几个星期
	 * @param {number|string} year
	 * @param {number|string} month
	 * @returns {number}
	 */
	getweeksInMonth(year, month) {
		let days = this.getMonthDays(year, month);
		let FirstDayWeekday = this.getWeekday(year, month, 1);
		return Math.ceil((days + FirstDayWeekday) / 7);
	}

	/**
	 * 获取当前月份排列信息
	 * @param {any} year 获取的年份
	 * @param {any} month 获取的月份
	 * @param {any} day 判断是否是当前天
	 * @param {any} type 表明要星期几开头，0为星期一开头，1为星期日开头，默认为0
	 * @returns {any}
	 */
	getMonthDaysArray(year = YEAR, month = MONTH, day) {
		if (typeof day === 'undefined' && year === YEAR && month === MONTH)
			day = DAY;
		let dayArrays = [];
		const days = this.getMonthDays(year, month),
			preDays = this.getMonthDays(year, month - 1);
		const thisMonthFirstDayInWeek = this.getWeekday(year, month, 1),
			thisMonthLastDayInWeek = this.getWeekday(year, month, days);
		const thisMonthAllDays =
			thisMonthFirstDayInWeek + days + 6 - thisMonthLastDayInWeek;
		//上月在当月日历面板中的排列
		for (let i = 0; i < thisMonthFirstDayInWeek; i++) {
			dayArrays.push({
				dayNum: preDays - thisMonthFirstDayInWeek + i + 1,
				weekDay: this.WEEKTABLE.common.cn[i],
			});
		}
		//当月日历面板中的排列
		for (let i = 1; i <= days; i++) {
			const weekDayFlag = (thisMonthFirstDayInWeek + i - 1) % 7;
			dayArrays.push({
				dayNum: i,
				weekDay: this.WEEKTABLE.common.cn[weekDayFlag],
				selected: i === +day,
				isThisMonth: true,
			});
		}
		//下月在当月日历面板中的排列
		for (let i = 1; i <= 6 - thisMonthLastDayInWeek; i++) {
			const weekDayFlag = (thisMonthFirstDayInWeek + days + i - 1) % 7;
			dayArrays.push({
				dayNum: i,
				weekDay: this.WEEKTABLE.common.cn[weekDayFlag],
			});
		}
		return dayArrays;
	}
}

export default CDate;
