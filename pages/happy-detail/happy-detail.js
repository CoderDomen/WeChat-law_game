import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import ImgSrc from '../../config/imgSrc';
import { ElseAnimate } from '../../animatie/happy';
import { CAT } from '../../config/config';
// 静态二级建筑数据
import Common from '../../model/commonModel';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { ShareCore, normalShareContent } from '../../utils/util';
import EV from '../../class/event';

let common = new Common();
let ea = null;

// 底部按钮状态
const BOTTOM_STATUS = {
	// 黄色
	NOT_ACTIVE: ImgSrc.HAPPY_BOTTOM_BTN_BG,
	// 灰色
	ACTIVE: ImgSrc.HAPPY_BOTTOM_BTN_LOCK,
};

Page({
	PIC01: null,
	PIC02: null,
	PIC03: null,
	behaviors: [navBev, ImgBev],
	data: {
		catid: CAT.HAPPINESS,
		// 是否选择
		hover: false,
		// 显示的图片01
		PIC01: '',
		// 显示的图片02
		PIC02: '',
		// 显示的图片03
		PIC03: '',
		// 显示的标签01
		LABEL01: '',
		// 显示的标签02
		LABEL02: '',
		// 显示的标签03
		LABEL03: '',
		// 对应的id编号
		ids: [],
		// 底部按钮状态
		buttonImg: BOTTOM_STATUS.NOT_ACTIVE,
		// 底部按钮是否激活，true --> 已激活
		buttonAc: false,
		// 上一次激活的索引
		idx: undefined,
		// 上一次 id
		lastId: undefined,
		// 保存激活索引
		activeArr: [],
		// 当前选中id
		selected_id: undefined,
		// 图片列表
		imgList: [],
		// 一级标题
		title: ''
	},

	async onLoad(options) {
		ea = new ElseAnimate(this);
		const { id, title } = options;
		this.data.title = title;
		// 匹配资源
		await this._matchResourceById(id);
	},
	onUnload() {},

	async onShow() {
		this._checkError();
		if (this.isShare) {
			let type = 0;
			await ShareCore.call(this, type);
			this.setData({
				user: Store.get('user'),
			});
			this.isShare = false;
		}
	},

	// 选择
	handleSelect(e) {
		if (e.target.id === 'BottomBtn' || e.target.id === 'music') {
			return;
		}
		if (this.data.idx === 0 && this.data.BtnShow) {
			return;
		}
		let { pic } = e.target.dataset;
		// 如果点中项目
		if (pic) {
			this.data.selected_id = e.target.dataset.id;
			if (this.data.BtnShow && +pic === this.data.idx) {
				return;
			}
			if (this.data.idx && this.data.lastId) {
				const { idx, lastId } = this.data;
				const active = this.data.activeArr.includes(lastId);
				if (!active) {
					this.setData({
						[`PIC0${idx}`]: this[`PIC0${idx}`].NOT_ACTIVE,
					});
				}
			}
			// 是否已经激活
			const active = this.data.activeArr.includes(+this.data.selected_id);
			this.setData({
				hover: true,
				[`PIC0${pic}`]: active
					? this[`PIC0${pic}`].ACTIVE
					: this[`PIC0${pic}`].HOVER,
				buttonImg: active ? BOTTOM_STATUS.ACTIVE : BOTTOM_STATUS.NOT_ACTIVE,
				buttonAc: active ? true : false,
			});
			// 没显示的情况，防抖
			if (!this.data.BtnShow) {
				console.log('btn show');
				this.setData({
					buttonImg: active ? BOTTOM_STATUS.ACTIVE : BOTTOM_STATUS.NOT_ACTIVE,
					buttonAc: active ? true : false,
					BtnShow: true,
				});
				this._buttonAnimationIn();
			}
			this.data.idx = +pic;
			this.data.lastId = this.data.selected_id;
		} else {
			pic = this.data.idx || 0;
			const active = this.data.activeArr.includes(+pic);
			if (!this.data.hover || !this.data.BtnShow) {
				this.data.idx = 0;
				return;
			}
			this.setData({
				[`PIC0${pic}`]: active
					? this[`PIC0${pic}`].ACTIVE
					: this[`PIC0${pic}`].NOT_ACTIVE,
				hover: false,
			});
			this.data.idx = 0;
			this._buttonAnimationOut();
		}
	},

	// 解锁项目
	async unlock() {
		const pic = this.data.idx;
		const build = this[`PIC0${pic}`];
		if (this.data.activeArr.includes(this.data.selected_id)) {
			return wx.showToast({
				title: '已解锁',
				icon: 'none',
			});
		}
		if (this.data.activeArr.length > 0) {
			return wx.showToast({
				title: `${this.data.title}您已解锁建筑了, 请去解锁其他版块吧`,
				icon: 'none',
				duration: 2000
			});
		}

		wx.showLoading({
			mask: true
		})
		let unlockRes = await common.unlock(
			UserModel.hasUid(),
			this.data.selected_id
		);
		if (unlockRes.successed) {
			wx.showToast({
				title: '解锁成功',
			});
			// 更新缓存
			let mcsl = UserModel.getCacheUser('mcsl');
			UserModel.updateCacheUser('mcsl', mcsl - unlockRes.need_mcsl);
			// 触发事件
			EV.emit('mcsl');

			this.data.activeArr.push(this.data.selected_id);
			this.setData({
				[`PIC0${pic}`]: this[`PIC0${pic}`].ACTIVE,
				buttonAc: false,
				buttonImg: BOTTOM_STATUS.NOT_ACTIVE,
				activeArr: this.data.activeArr,
			});
			this._buttonAnimationOut();
		} else {
			if (unlockRes.msg) {
				return wx.showToast({
					title: `${unlockRes.msg}, ${build.label}所需${unlockRes.need_mcsl}根木材才可以解锁`,
					duration: 2000,
					icon: 'none',
				});
			} else {
				wx.showToast({
					title: '解锁失败',
					icon: 'none',
				});
			}
		}
	},

	onShareAppMessage: function () {
		this.isShare = true;
		return normalShareContent();
	},

	// 获取木材（去答题）
	handleGet() {
		wx.navigateTo({
			url: '/pages/happy-answer/happy-answer',
		});
	},

	handleLoadSuc(e) {
		const { activeArr } = this.data;
		this.setData(
			{
				PIC01: getInfo(this.PIC01, 'NOT_ACTIVE'),
				PIC02: getInfo(this.PIC02, 'NOT_ACTIVE'),
				PIC03: getInfo(this.PIC03, 'NOT_ACTIVE'),
				LABEL01: getInfo(this.PIC01, 'label'),
				LABEL02: getInfo(this.PIC02, 'label'),
				LABEL03: getInfo(this.PIC03, 'label'),
			},
			() => {
				wx.hideLoading();
			}
		);

		function getInfo(obj, key) {
			
			if (key === 'NOT_ACTIVE') {
				// 检查是否已经解锁过
				if (activeArr.length > 0 && activeArr.includes(obj.id)) {
					return obj['ACTIVE'];
				} else {
					return obj[key];
				}
			}
			return obj[key] || '';
		}
	},

	// 根据id匹配资源
	async _matchResourceById(id) {
		let { data } = await common.getHappyDetailImg(id);
		let ids = [],
			activeArr = [],
			imgList = [];

		
			wx.showLoading();
			let myBuild = Store.get('mybuild');
			myBuild.forEach(build => {
				if (build.pid === +id) {
					activeArr.push(build.id);
				}
			});
			data.data.forEach((item, index) => {
				this[`PIC0${index + 1}`] = {
					id: item.id,
					ACTIVE: item.imgSrc,
					HOVER: item.img3,
					NOT_ACTIVE: item.img2,
					label: item.label,
				};
				ids.push(item.id);
				imgList.push(item.img2, item.img3, item.imgSrc);
			});
		this.setData({
			ids,
			activeArr,
			imgList,
		});
	},
	// 检查错误
	_checkError() {
		let error = Store.get('happy_error');
		if (error) {
			wx.showToast({
				title: error,
				icon: 'none',
			});
			Store.remove('happy_error');
		}
	},
	// 底部按钮进入动画
	_buttonAnimationIn() {
		ea.buttonAnimationIn();
	},
	// 底部按钮进入动画
	_buttonAnimationOut() {
		ea.buttonAnimationOut(() => {
			this.setData({
				BtnShow: false,
			});
		});
	},
});
