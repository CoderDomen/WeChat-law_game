import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import ImgRes from '../../config/config';
import { PRO_BASE_URL } from '../../config/URI';
import {
	IDENTIFY,
	GAME_MODE
} from '../../config/config';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import {
	ShareCore,
	normalShareContent
} from '../../utils/util';

Page({
	isShare: false,
	behaviors: [navBev, ImgBev],
	data: {
		duration:0,
		currentTime:0,
		restTime:0,
		age: '',
		// baseurl: "https://sifa.prod.hello4am.com",
		baseurl: PRO_BASE_URL,
		uid: '',
		myaudio: '',
		vidoeallurl: '',
		isPlayingAudio: true,
		listnumber: [],
		totalaudionumber: '',
		successplayaudio: [],
		nowplayingaudio: 1,
		newUrlArr: [],
		newUrlArr2:[],
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */

		// 监听播放事件
			

	



	onLoad() {
		this._loadImgSrc();
		this.setData({
			musicbtn: true,
			isPlayingAudio: true,
			listnumber: 1,
		});
		const uuid = wx.getStorageSync('uid');
		const currentaudiolevel = wx.getStorageSync('currentaudiolevel');
		const stage2 = wx.getStorageSync('stage2');
		wx.request({
			url: this.data.baseurl + "/getQcrsPassInfo",
			method: 'GET',
			data: {
				currentPass: currentaudiolevel,
				stage: stage2,
				uid: uuid
			},
			success: (res) => {
				console.log(res.data.data);
				this.data.newUrlArr = res.data.data.passInfo.newUrlArr;
				this.data.newUrlArr2 = JSON.parse(JSON.stringify(this.data.newUrlArr));
				var newUrlArr = res.data.data.passInfo.newUrlArr;
				var url = JSON.parse(res.data.data.passInfo.url);
				newUrlArr.forEach(item => {
					if(item.title.length > 12){
						item.title = item.title.substring(0,11)+"...";
					}
					if(item.note.length > 24){
						item.note = item.note.substring(0,23)+"...";
					}
				});
				console.log(url);
				console.log(this.data.newUrlArr);
				this.data.vidoeallurl = url;
				this.data.totalaudionumber = url.length;
				this.setData({
					mp4src: url[0].url,
					knows: newUrlArr,
					playingaudiotitle: this.data.newUrlArr2[0].title,
				});
				this.data.myaudio = wx.createInnerAudioContext({});
				this.data.myaudio.src = url[0].url;
				// 进入播放状态
				this.data.myaudio.onCanplay(()=>{
					this.data.myaudio.duration;	
					setTimeout(() => {
						console.log(this.data.myaudio.duration); 
						this.setData({
							duration:parseInt(this.data.myaudio.duration)
						})
					}, 500)
				})
				// 播放
				this.data.myaudio.play();
				console.log(res.data);
				// 监听播放时
				this.data.myaudio.onTimeUpdate(()=>{
					this.data.myaudio.currentTime;
					this.setData({
						currentTime:parseInt(this.data.myaudio.currentTime)
					})
					let rest = this.data.duration  - this.data.currentTime
					this.setData({
						restTime:rest
					})
					
				})
			

				this.data.myaudio.onEnded((res) => { //监听播放结束
					console.log(this.data.nowplayingaudio);
					const pass = wx.getStorageSync('pass');
					const uuid = wx.getStorageSync('uid');
					const stage2 = wx.getStorageSync('stage2');
					const stage = wx.getStorageSync('stage');
					this.setData({
						nowplayingaudio: this.data.nowplayingaudio,
						isPlayingAudio:false
					});
					for (var i = 0; i < this.data.successplayaudio.length; i++) {
						if (this.data.nowplayingaudio != this.data.successplayaudio[i]) {
							this.data.successplayaudio.push(this.data.nowplayingaudio);
						}
					};

					console.log("监听播放结束");
					const currentaudiolevel = wx.getStorageSync('currentaudiolevel');
					wx.request({
						url: this.data.baseurl + "/qcrsPassCallback",
						method: 'POST',
						data: {
							uid: uuid,
							stage: stage,
							pass: currentaudiolevel,
							passMedia: this.data.nowplayingaudio - 1,
						},
						success: (res) => {
							this.setData({
								clearance: false,
								clearance2: true,
								pass: res.data.data.pass
							});
							wx.setStorage({
								data: res.data.data.pass,
								key: 'pass',
							});
							wx.setStorage({
								data: res.data.data.stage,
								key: 'stage',
							});
							const stage2 = wx.getStorageSync('stage2');
							const stage = wx.getStorageSync('stage');
							if (stage2 == stage && stage < res.data.data.stage) {
								console.log("rdcftvbuhnijk");
								this.setData({
									shareshow: true,

								});
							};

							console.log(res.data);
							const uuid = wx.getStorageSync('uid');
							const pass = wx.getStorageSync('pass');
							const currentaudiolevel = wx.getStorageSync('currentaudiolevel');
							wx.request({
								url: this.data.baseurl + "/getQcrsPassInfo",
								method: 'GET',
								data: {
									currentPass: currentaudiolevel,
									stage: stage2,
									uid: uuid
								},
								success: (res) => {

									var newUrlArr = res.data.data.passInfo.newUrlArr;

									this.setData({

										knows: newUrlArr
									});
								}
							})

						},

					})

				});
			},
		});
		console.log(this.data.myaudio);


		// setTimeout(() => {
		// 	console.log(this.data.myaudio);
		// 	this.data.myaudio.onEnded((res) => { //监听播放结束
		// 		console.log(this.data.nowplayingaudio);
		// 		const pass = wx.getStorageSync('pass');
		// 		const uuid = wx.getStorageSync('uid');
		// 		const stage2 = wx.getStorageSync('stage2');
		// 		const stage = wx.getStorageSync('stage');
		// 		this.setData({
		// 			nowplayingaudio: this.data.nowplayingaudio,
		// 		});
		// 		for (var i = 0; i < this.data.successplayaudio.length; i++) {
		// 			if (this.data.nowplayingaudio != this.data.successplayaudio[i]) {
		// 				this.data.successplayaudio.push(this.data.nowplayingaudio);
		// 			}
		// 		};

		// 		console.log("监听播放结束");

		// 		wx.request({
		// 			url: this.data.baseurl + "/qcrsPassCallback",
		// 			method: 'POST',
		// 			data: {
		// 				uid: uuid,
		// 				stage: stage,
		// 				pass: 1
		// 			},
		// 			success: (res) => {
		// 				this.setData({
		// 					clearance: false,
		// 					clearance2: true,
		// 					pass: res.data.data.pass
		// 				});
		// 				const stage2 = wx.getStorageSync('stage2');
		// 				const stage = wx.getStorageSync('stage');
		// 				if (stage2 == stage && stage < res.data.data.stage) {
		// 					console.log("rdcftvbuhnijk");
		// 					this.setData({
		// 						shareshow: true,

		// 					});
		// 				};
		// 				wx.setStorage({
		// 					data: res.data.data.stage,
		// 					key: 'stage',
		// 				});
		// 				wx.setStorage({
		// 					data: res.data.data.pass,
		// 					key: 'pass',
		// 				});
		// 				console.log(res.data);
		// 			},

		// 		})

		// 	});
		// }, 2000)


	},
	onShow() {

	},

	onHide: function () {
		this.data.myaudio.pause();
		this.setData({
			musicbtn: true
		});
	},
	onUnload:function(){
		this.data.myaudio.stop();
	},
	// 导航栏返回
	handleNavBack() {
		this.data.myaudio.stop();
		wx.navigateTo({
			// url: "/pages/life-detail/life-detail.wxml"
			url:'/pages/life-detail/life-detail'
		})
	},
	handleEnd() {

	},
	handleaudioplay(e) {
		var isPlayingAudio = this.data.isPlayingAudio;
		console.log(isPlayingAudio);
		if (isPlayingAudio) {
			this.data.myaudio.pause();
			this.setData({
				isPlayingAudio: false
			});
			this.data.isPlayingAudio = false;

		} else {
			this.data.myaudio.play();
			this.setData({
				isPlayingAudio: true
			});
			this.data.isPlayingAudio = true;
		}
	},

	handleSelect(e) {
		var videourlindex = e.currentTarget.dataset.videoindex;
		var playvideourl = this.data.vidoeallurl[videourlindex].url;
		var title = this.data.newUrlArr2[videourlindex].title;
		// var title = e.currentTarget.dataset.title;
		// if(videourlindex){

		// };
		this.data.myaudio.stop();
		this.data.myaudio.src = playvideourl;
		this.data.myaudio.play();
		this.setData({
			isPlayingAudio: true,
			listnumber: videourlindex + 1,
			playingaudiotitle: title,
		});
		this.data.nowplayingaudio = videourlindex + 1;
		this.data.isPlayingAudio = true;
		// 监听播放时
		this.data.myaudio.onTimeUpdate(()=>{
			this.data.myaudio.currentTime;
			this.setData({
				currentTime:parseInt(this.data.myaudio.currentTime)
			})
			let rest = this.data.duration  - this.data.currentTime
			this.setData({
				restTime:rest
			})
			
		})
	}

})