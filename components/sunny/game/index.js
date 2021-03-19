import ImgBev from '../../../behaviors/imgBev';
import ImgRes from '../../../config/imgSrc';
import { matchGrowTitle } from '../../../utils/util';
import { SUNNY_SOFT_TYPE } from '../../../config/config';
import TypeTimer from '../../../class/timer';
import Store from '../../../model/storeModel';
import UserModel from '../../../model/userModel';
import { SunnyTree } from '../../../animatie/sunny';
import Common from '../../../model/commonModel';

let common = new Common();
let st = null;

const key_type_time = {
	sun_time: 'sun_time',
	water_time: 'water_time',
	fert_time: 'fert_time',
	grass_time: 'glass_time',
};

Component({
	behaviors: [ImgBev],
	properties: {
		// 是否开启定时器
		lock: Boolean,
		// 倒计时的类型
		acType: {
			type: Object,
			value: null,
		},
		// 停止计时器
		stop: Boolean,
		progress: Array,
		// 树木生长情况
		tree_status: {
			type: Number,
			value: -1,
		},
	},

	data: {
		// 生长历程
		status: 0,
		// 生长历程提示
		grow: '幼苗期',
		// 阳光
		[SUNNY_SOFT_TYPE.SUN]: null,
		// 浇水
		[SUNNY_SOFT_TYPE.WATER]: null,
		// 施肥
		[SUNNY_SOFT_TYPE.FERTILIZER]: null,
		// 除草
		[SUNNY_SOFT_TYPE.GRASS]: null,
		// 阳光时间
		[key_type_time.sun_time]: '00:00',
		// 浇水时间
		[key_type_time.water_time]: '00:00',
		// 施肥时间
		[key_type_time.fert_time]: '00:00',
		// 除草时间
		[key_type_time.grass_time]: '00:00',
		// 闯关等级
		els: [
			{
				type: SUNNY_SOFT_TYPE.SUN,
				iconSrc: ImgRes.SUNNY_GAME_SUN,
				uniconSrc: ImgRes.SUNNY_GAME_UNSUN,
				ac: true,
				pro: 0,
				config: 2,
			},
			{
				type: SUNNY_SOFT_TYPE.WATER,
				iconSrc: ImgRes.SUNNY_GAME_WATER,
				uniconSrc: ImgRes.SUNNY_GAME_UNWATER,
				ac: true,
				pro: 0,
				config: 2,
			},
			{
				type: SUNNY_SOFT_TYPE.FERTILIZER,
				iconSrc: ImgRes.SUNNY_GAME_GROW,
				uniconSrc: ImgRes.SUNNY_GAME_UNGROW,
				ac: true,
				pro: 0,
				config: 2,
			},
			{
				type: SUNNY_SOFT_TYPE.GRASS,
				iconSrc: ImgRes.SUNNY_GAME_GREEN,
				uniconSrc: ImgRes.SUNNY_GAME_UNGREEN,
				ac: true,
				pro: 0,
				config: 2,
			},
		],
		// 种子 --> 幼苗状态, 手指与文案隐藏
		display: true,
	},

	observers: {
		tree_status(val) {
			// val === null || val === undefined 的简写
			if (val == null || val < 0) {
				return;
			}
			let tree_status = Store.get('tree_status');
			if (!tree_status && val < 1) {
				this.data.els.forEach(el => {
					el.ac = false;
				});
			}
			let status = val;
			let grow = false;
			if (status !== 0 && this.data.status !== 0 && status > this.data.status) {
				grow = true;
			}
			if (grow) {
				return this.handleNextGrow();
			}
			this.setData({
				status,
				grow: matchGrowTitle(status),
				els: this.data.els,
				display: status <= 0 ? true : false,
			});
			st.fadeIn(`#status${this.data.status}`);
		},
		progress(val) {
			if (val.length > 0) {
				val.forEach(v => {
					switch (v.type) {
						// 阳光
						case 'ygl':
							this.data.els[0].pro = v.user_pro;
							this.data.els[0].config = v.config;
							// this.data.els[0].config = 2;
							break;
						// 浇水
						case 'jsl':
							this.data.els[1].pro = v.user_pro;
							this.data.els[1].config = v.config;
							// this.data.els[1].config = 2;
							break;
						// 施肥
						case 'sfs':
							this.data.els[2].pro = v.user_pro;
							this.data.els[2].config = v.config;
							// this.data.els[2].config = 2;
							break;
						// 除草
						case 'ccs':
							this.data.els[3].pro = v.user_pro;
							this.data.els[3].config = v.config;
							// this.data.els[3].config = 2;
					}
				});
				this.setData({
					els: this.data.els,
				});
			}
		},

		stop(val) {
			if (val) {
				this._stopTimer();
			}
		},

		lock(val) {
			let type = this.properties.acType;
			if (val && type) {
				let newEls = this.data.els.map(el => {
					if (type.types.includes(el.type)) {
						// 激活显示对象
						el.ac = false;
						// 判断是否已经激活过
						// 最好传递时间
						let res = this._activeTimer(el.type, type[el.type]);
						// 已经实例化
						if (res) {
							this.data[el.type].setTime(Math.abs(Date.now() - type[el.type]));
							// 开始倒计时
							this.data[el.type].startTimer(() => {
								this._univerCallBack(el.type);
							});
						}
					} else {
						el.ac = true;
					}
					return el;
				});
				this.setData({
					els: newEls,
				});
			}
		},
	},

	created() {
		st = new SunnyTree(this);
	},

	methods: {
		// 播种子
		handle2Grow() {
			if (this.data.status > 0) {
				return;
			}
			// 切换状态
			this.setData(
				{
					grow: matchGrowTitle(1),
					display: false,
				},
				async () => {
					wx.showLoading();
					Store.set('tree_status', 1);
					// 动画切换

					let putSeedRes = await common.putSeed(UserModel.hasUid());
					if (putSeedRes.data.successed) {
						st.fadeOut('#finder');
						st.fadeOut('#tipText', () => {
							this.triggerEvent('fetch');
							this.data.els.forEach(item => {
								item.ac = true;
							});
							this.setData({
								status: 1,
								els: this.data.els,
							});
							wx.hideLoading();
						});
					} else {
						return wx.showToast({
							title: '发生错误, 请稍后再试',
							icon: 'none',
						});
					}
				}
			);
		},

		// 进入下一生长期
		handleNextGrow() {
			st.fadeOut(`#status${this.data.status}`, () => {
				this.setData({
					status: this.data.status + 1,
					grow: matchGrowTitle(this.data.status + 1),
				});
				st.fadeIn(`#status${this.data.status}`);
			});
		},

		// 种类点击
		handleTypeTap(e) {
			if (this.data.status <= 0) {
				return wx.showToast({
					title: '请先播种子喔',
					icon: 'none',
				});
			}
			const { type, pro, ac, config } = e.currentTarget.dataset;
			if (!ac) {
				wx.showToast({
					title: '请稍等后再闯关喔',
					icon: 'none',
				});
				return;
			}
			if (pro >= config) {
				wx.showToast({
					title: '已经够了哦',
					icon: 'none',
				});
				return;
			}
			this.triggerEvent('goQue', {
				type,
				pro: pro + 1,
				total:config
			});
		},
		// 分享
		onShare() {
			this.triggerEvent('share');
		},

		//激活时间对象
		_activeTimer(type, timeStamp) {
			if (!timeStamp || !type) {
				return false;
			}
			let result = false;
			switch (type) {
				case SUNNY_SOFT_TYPE.SUN:
					if (!this.data[SUNNY_SOFT_TYPE.SUN]) {
						this.data[SUNNY_SOFT_TYPE.SUN] = new TypeTimer(
							key_type_time.sun_time,
							this,
							timeStamp
						);
						this.data[SUNNY_SOFT_TYPE.SUN].startTimer(() => {
							this._univerCallBack(type);
						});
					} else {
						result = true;
					}
					break;
				case SUNNY_SOFT_TYPE.WATER:
					if (!this.data[SUNNY_SOFT_TYPE.WATER]) {
						this.data[SUNNY_SOFT_TYPE.WATER] = new TypeTimer(
							key_type_time.water_time,
							this,
							timeStamp
						);
						this.data[SUNNY_SOFT_TYPE.WATER].startTimer(() => {
							this._univerCallBack(type);
						});
					} else {
						result = true;
					}
					break;
				case SUNNY_SOFT_TYPE.FERTILIZER:
					if (!this.data[SUNNY_SOFT_TYPE.FERTILIZER]) {
						this.data[SUNNY_SOFT_TYPE.FERTILIZER] = new TypeTimer(
							key_type_time.fert_time,
							this,
							timeStamp
						);
						this.data[SUNNY_SOFT_TYPE.FERTILIZER].startTimer(() => {
							this._univerCallBack(type);
						});
					} else {
						result = true;
					}
					break;
				case SUNNY_SOFT_TYPE.GRASS:
					if (!this.data[SUNNY_SOFT_TYPE.GRASS]) {
						this.data[SUNNY_SOFT_TYPE.GRASS] = new TypeTimer(
							key_type_time.grass_time,
							this,
							timeStamp
						);
						this.data[SUNNY_SOFT_TYPE.GRASS].startTimer(() => {
							this._univerCallBack(type);
						});
					} else {
						result = true;
					}
					break;
			}
			return result;
		},

		_univerCallBack(type) {
			console.log('结束回调', type);
			// 将自己的ac开启
			this.data.els.forEach(el => {
				if (el.type === type) {
					el.ac = true;
				}
			});
			// 删除缓存
			{
				let sunny_down = Store.get('sunny_down');
				let idx = sunny_down.types.findIndex(val => val === type);
				sunny_down.types.splice(idx, 1);
				Reflect.deleteProperty(sunny_down, type);
				Store.set('sunny_down', sunny_down);
			}
			this.setData({
				els: this.data.els,
			});
		},

		// 停止所有的计时器
		_stopTimer() {
			Object.keys(SUNNY_SOFT_TYPE).forEach(key => {
				key = SUNNY_SOFT_TYPE[key];
				this.data[key] && this.data[key].clearTimer();
				this.data[key] = null;
			});
		},
	},
});
