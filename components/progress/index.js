import {DOWN_TIME} from '../../config/config'
import ImgBev from '../../behaviors/imgBev';

const MIN = 0,
	MAX = 360;
const BOUNDVALUE = {
	ONE: 90,
	TWO: 180,
	THREE: 270,
	FOUR: 360,
};

let deg = null;

Component({
	behaviors: [ImgBev],
	properties: {
		// 倒计时时间
		time: {
			type: Number,
			value: DOWN_TIME,
		},
		height: {
			type: String,
		},
		width: {
			type: String,
		},
		// 是否选中题目
		selected: Boolean,
		// 关闭定时器
		close: Boolean,
		// 类别，用来切换不同样式
		type: String,
		// 获取时间
		get: Boolean,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		count: MIN,
		timer: null,
		fps: null,
		ra01: 0,
		ra02: 0,
		ra03: 0,
		ra04: 0,
		_time: null,
		first: true,
	},

	observers: {
		get(val) {
			if(val) {
				this.triggerEvent('time', {
					time: this.data._time
				})
			}
		},
		close(val) {
			if (val) {
				clearInterval(this.data.timer);
			}
		},
		selected(val) {
			if (this.data.first) {
				this.data.first = false;
				return;
			}
			if (val) {
				// 已选答案，停止倒计时，并广播事件,不是folk模式
				clearInterval(this.data.timer);
				this.triggerEvent('stop', {
					time: this.data._time,
				});
				return;
			}
			// 重新开始
			this._reback();
			this._start();
		},
	},

	attached() {
		this._start();
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 重置绑定参数
		_reback() {
			this.setData({
				count: MIN,
				timer: null,
				fps: null,
				ra01: 0,
				ra02: 0,
				ra03: 0,
				ra04: 0,
				_time: null,
			});
		},

		// 启动倒计时
		_start() {
			deg = parseInt(360 / this.properties.time);
			this.setData({
				fps: +(1000 / deg).toFixed(2),
				_time: this.properties.time,
			});
			this.data.timer = setInterval(() => {
				// console.log(111); 需要把 - 30 去掉
				if (this.data.count >= MAX) {
					clearInterval(this.data.timer);
					this.triggerEvent('end');
					console.log('end');
					return;
				}
				this.data.count++;
				if (this.data.count <= BOUNDVALUE.ONE) {
					this._rotate('ra01', this.data.count);
				} else if (
					this.data.count > BOUNDVALUE.ONE &&
					this.data.count <= BOUNDVALUE.TWO
				) {
					this._rotate('ra02', this.data.count - BOUNDVALUE.ONE);
				} else if (
					this.data.count > BOUNDVALUE.TWO &&
					this.data.count <= BOUNDVALUE.THREE
				) {
					this._rotate('ra03', this.data.count - BOUNDVALUE.TWO);
				} else {
					this._rotate('ra04', this.data.count - BOUNDVALUE.THREE);
				}

				if (this.data.count % deg === 0) {
					this.setData({
						_time: this.properties.time - this.data.count / deg,
					});
				}
			}, this.data.fps);
		},
		// 更新旋转数据
		_rotate(prop, value) {
			this.setData({
				[prop]: value,
			});
		},
	},
});
