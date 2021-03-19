import ImgBev from '../../../behaviors/imgBev';
import { checkGongAvatar } from '../../../utils/util';
import UserModel from '../../../model/userModel';
import Store from '../../../model/storeModel';

Component({
	behaviors: [ImgBev],
	properties: {
		// 大关
		hard: Number,
		// 小关
		progress: Number,
		gjSex: Number,
	},

	observers: {
		hard(val) {
			if(val) {
				const gjSex=this.properties.gjSex;
				const src = checkGongAvatar(gjSex, val);
				// const src = checkGongAvatar(UserModel.getGameSexInfo(), val);
				console.log(UserModel.getGameSexInfo());
				wx.getImageInfo({
					src: src,
					success: res => {
						const { width, height } = res;
						let rate = width / this.data.avatarWidth;
						let realHeight = height / rate;
						this.setData({
							avatarHeight: realHeight,
							avatarSrc: src
						})
					},
					fail: err => {
						wx.showToast({
							title: '图片加载错误',
							icon: 'none'
						})
					},
				});
			}
		}
	},

	data: {
		avatarHeight: 0,
		avatarWidth: 600,
		load: true,
		rankData: [
			{
				name: '新手',
				selected: false,
				checkpoint: 0,
			},
			{
				name: '弓箭手',
				selected: false,
				checkpoint: 0,
			},
			{
				name: '幻影射手',
				selected: false,
				checkpoint: 0,
			},
			{
				name: '神箭手',
				selected: false,
				checkpoint: 0,
			},
			{
				name: '弓魂',
				selected: false,
				checkpoint: 0,
			},
		],
	},

	attached() {
		let { hard, progress } = this.properties;
		if (progress >= 4) {
			hard = Math.min(++hard, 5);
			if (hard < 5) {
				progress = 0;
			}
		}
		this._loadImgSrc();
		this.data.rankData.forEach((rank, index) => {
			const curIdx = index + 1;
			// hard大关， progress小关
			if (curIdx <= hard) {
				rank.selected = true;
				if (curIdx < hard) {
					rank.checkpoint = 4;
				}
				if (curIdx === hard) {
					rank.checkpoint = Math.min(progress, 4);
				}
			}
		});
		console.log(this.data.rankData);
		this.setData({
			rankData: this.data.rankData,
		});
	},

	methods: {
		onContinue() {
			const {shield} = Store.get('user');
			if(shield <= 0) {
				return wx.showToast({
					title: '护盾已用完',
					icon: 'none'
				})
			}
			this.triggerEvent('continue');
		},
		avatarOnLoad() {
			setTimeout(() => {
				this.setData({
					load: true
				})
			}, 300)
		}
	},
});
