const timeTransform = Symbol('转换时间');
const updateTime = Symbol('更新时间戳');
const timeInterval = 1000;

class TypeTimer {
	// 展示时间
	showTime = null;
	// 实际时间戳
	timeStamp = null;
	// 定时器
	timer = null;
	constructor(type, self, timeStamp) {
		// 代表类型
		this.type = type;
		// 指针
		this.self = self;
		// 时间戳
		this.timeStamp = Math.abs(+Date.now() - timeStamp);
		// 展示的时间（经过处理）
		this.showTime = this.getShowTime();
	}

	/**
	 * 开始计时器
	 * @returns {any}
	 */
	startTimer(finish_fn) {
		clearInterval(this.timer);
		this.timer = setInterval(() => {
			console.log('run');
			if (this.timeStamp <= 0) {
				clearInterval(this.timer);
				finish_fn && finish_fn();
				return;
				// end
			}
			this[updateTime]();
			this.self.setData({
				[this.type]: this.getShowTime(),
			});
		}, timeInterval);
	}

	/**
	 * 设置时间
	 * @returns {any}
	 */
	setTime(time) {
		if (Number.isNaN(time)) {
			return;
		}
		this.timeStamp = time;
	}

	/**
	 * 更新时间
	 * @returns {any}
	 */
	[updateTime](time = 1000) {
		let afterTime = this.timeStamp - time;
		this.timeStamp = afterTime < 0 ? 0 : afterTime;
	}

	/**
	 * 获取展示时间
	 * @returns {any}
	 */
	getShowTime() {
		return this[timeTransform](this.timeStamp);
	}

	/**
	 * 清理定时器
	 * @returns {any}
	 */
	clearTimer() {
		console.log('停止定时器', this.timer);
		clearInterval(this.timer);
	}

	// 时间转换
	[timeTransform](timeStamp) {
		timeStamp = parseInt(timeStamp / 1000);
		let second = timeStamp % 60;
		let minute = parseInt(timeStamp / 60);
		minute = minute < 10 ? '0' + minute : minute;
		second = second < 10 ? '0' + second : second;
		return minute + ':' + second;
	}
}

export default TypeTimer;
