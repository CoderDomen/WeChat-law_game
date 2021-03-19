import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import { IDENTIFY, GAME_MODE } from '../../config/config';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { ShareCore, normalShareContent } from '../../utils/util';
import { PRO_BASE_URL } from '../../config/URI';


Page({
	isShare: false,
	tapShare: false,
	behaviors: [navBev, ImgBev],
	data: {
		isPlayingAudio: false,
		// audiourl:'https://m10.music.126.net/20200903172033/be7fc14d92ee6bf29a4719f80fcf749f/yyaac/obj/wonDkMOGw6XDiTHCmMOi/1938960727/71b1/3c47/2a8c/381f036eb2223f0bfe5eadc31b1126fb.m4a',
		audiourl:'',
		myaudio:'',
		videoshow:false,
		// baseurl:"https://sifa.prod.hello4am.com",
		baseurl:PRO_BASE_URL,
		bgaudio:'',
	},

	onLoad() {
		// console.log(pass);
		
		this._loadImgSrc();
		const pass=wx.getStorageSync('pass');
		const uuid=wx.getStorageSync('uid');
		const stage2=wx.getStorageSync('stage2');
		const stage=wx.getStorageSync('stage');
		this.setData({
			pass:pass,
			listitem:["第一关","第二关","第三关","第四关","第五关","第六关","第七关","第八关","第九关","第十关","第十一关","第十二关","第十三关","第十四关","第十五关","第十六关","第十七关","第十八关","第十九关","第二十关"],
			stage:stage,
			stage2:stage2,
			shareshow:false
		});
		
		// this.data.myaudio = wx.createInnerAudioContext({});
		// this.data.myaudio.onEnded((res)=> {//监听播放结束
			
		// 	console.log("监听播放结束");
			
		// 	wx.request({
		// 		url: this.data.baseurl+"/qcrsPassCallback",
		// 		method: 'POST',
		// 		data:{
		// 			uid:uuid,
		// 			stage:stage,
		// 			pass:1
		// 		},
		// 		success: (res) => {
		// 			this.setData({
		// 				clearance:false,
		// 				clearance2:true,
		// 				pass:res.data.data.pass
		// 			});
		// 			const stage2=wx.getStorageSync('stage2');
		// 			const stage=wx.getStorageSync('stage');
		// 			if(stage2==stage&&stage<res.data.data.stage){
		// 				console.log("rdcftvbuhnijk");
		// 				this.setData({
		// 					shareshow:true,
							
		// 				});
		// 			};
		// 			wx.setStorage({
		// 				data: res.data.data.stage,
		// 				key: 'stage',
		// 			}) ;
		// 			wx.setStorage({
		// 				data: res.data.data.pass,
		// 				key: 'pass',
		// 			}) ;
		// 			console.log(res.data);
		// 		},
			
		// 	})
			

			

		// });
		
			
		
		wx.request({
			url: this.data.baseurl+"/getQcrsStagePass",
			method: 'GET',
			data:{
				stage:stage2
			},
			success: (res) => {
				var newstagePass = res.data.data.stagePass;
				newstagePass.forEach(item => {
					if(item.totaltitle.length > 12){
						item.totaltitle = item.totaltitle.substring(0,11)+"...";
					}
					if(item.totalnote.length > 24){
						item.totalnote = item.totalnote.substring(0,23)+"...";
					}
				});
				console.log(res.data.data.stagePass);
				this.setData({
					  list:newstagePass
				});
				
				console.log(res.data);
			},
		})
	
	},
	async onShow(){
		// this.data.bgaudio = wx.createInnerAudioContext({});
		// this.data.bgaudio.src="https://cdn.static.sifa.prod.hello4am.com/mp3/comfortable.mp3";
		// this.data.bgaudio.play();
		// this.data.bgaudio.onEnded((res)=> {
		// 	this.data.bgaudio.play();
		// });


		const pass=wx.getStorageSync('pass');
		const uuid=wx.getStorageSync('uid');
		const stage2=wx.getStorageSync('stage2');
		const stage=wx.getStorageSync('stage');
		this.setData({
			stage:stage,
			stage2:stage2,
			pass:pass,
		});
		console.log(this.data.stage2);
		console.log(stage);  
		
		console.log(pass);
		
		if (this.isShare) {
			let type = 0;
			if (this.tapShare) {
				type = 1;
			}
			await ShareCore.call(this, 1);
			this.isShare = false;
			this.tapShare = false;
		}
	},
	onUnload(){
		// this.data.myaudio.stop();
		// this.data.bgaudio.stop();
	},
	tolifeanswer(e){
		// this.data.bgaudio.stop();
		if (UserModel.getCacheUser('shield') <= 0) {
			return wx.showToast({
				title: '护盾已用完',
				icon: 'none'
			});
		}
		
		let index = e.currentTarget.dataset['index'];
		index =index+1;
		console.log(index);
		wx.setStorage({
			data: index,
			key: 'currentanswerlevel',
		}) ;
		wx.navigateTo({
			url: '/pages/life-answer/life-answer',
		});
	},
	tolifereadcomics(e){
		// this.data.bgaudio.stop();
		let index = e.currentTarget.dataset['index'];
		index =index+1;
		console.log(index);
		wx.setStorage({
			data: index,
			key: 'currentreadcomicslevel',
		}) ;
		wx.setStorage({
			data: e.currentTarget.dataset.readcomicsurl,
			key: 'readcomicsurl',
		}) ;
		const currentreadcomicslevel=wx.getStorageSync('currentreadcomicslevel');
		const pass=wx.getStorageSync('pass');
	const uuid=wx.getStorageSync('uid');
	const stage=wx.getStorageSync('stage');
	wx.request({
		url: this.data.baseurl+"/qcrsPassCallback",
		method: 'POST',
		data:{
			uid:uuid,
			stage:stage,
			pass:currentreadcomicslevel,
		},
		success: (res) => {
			wx.setStorage({
				data: res.data.data.stage,
				key: 'stage',
			}) ;
			wx.setStorage({
				data: res.data.data.pass,
				key: 'pass',
			}) ;
		},

	});
	wx.navigateTo({
		url: '/pages/life-readcomics/life-readcomics',
	});
	},
	handleaudioplay(e){
		
		console.log(e.currentTarget.dataset.audiourl) ;
		
		
		this.data.audiourl=e.currentTarget.dataset.audiourl;
		this.data.myaudio.src =this.data.audiourl;
		var isPlayingAudio = this.data.isPlayingAudio;
    console.log(isPlayingAudio);
    if (isPlayingAudio) {
			this.data.bgaudio.play();
			this.data.myaudio.pause();
      this.setData({
        isPlayingAudio: false
      })
      
    } else {
			this.data.bgaudio.pause();
			this.data.myaudio.play();
      this.setData({
        isPlayingAudio:true
      })
    }
	},
	handlevideoplay(){
		this.setData({
			videoshow:true,
			// videoplayflag:true
			// videoplaystarttime:0
		});
		this.data.bgaudio.pause();
		var videoContext  = wx.createVideoContext('video1');
		videoContext.play();
	},
	handleEnd(){
		console.log("视频播放结束");
		this.data.bgaudio.play();
		const uuid=wx.getStorageSync('uid');
		const stage=wx.getStorageSync('stage');
		this.setData({
			clearance3:true
		});
		wx.request({
			url: this.data.baseurl+"/qcrsPassCallback",
			method: 'POST',
			data:{
				uid:uuid,
				stage:stage,
				pass:2
			},
			success: (res) => {
				this.setData({
					pass:res.data.data.pass,
					stage:res.data.data.stage,
				});
				const stage2=wx.getStorageSync('stage2');
					const stage=wx.getStorageSync('stage');
					if(stage2==stage&&stage<res.data.data.stage){
						console.log("rdcftvbuhnijk");
						this.setData({
							shareshow:true,
							
						});
					};
				wx.setStorage({
					data: res.data.data.stage,
					key: 'stage',
				}) ;
				wx.setStorage({
					data: res.data.data.pass,
					key: 'pass',
				}) ;
				console.log(res.data);
			},
		
		})
	},
	showhint(){
		wx.showToast({
			title: '请先通过上一关',
			icon: 'none',
			mask:false,
			duration: 2000
		}) 
	},
	tolifeaudiodetail(e){
		// this.data.bgaudio.stop();
		let index = e.currentTarget.dataset['index'];
		index =index+1;
		console.log(index);
		wx.setStorage({
			data: index,
			key: 'currentaudiolevel',
		}) ;
		wx.navigateTo({
			url: '/pages/life-audiodetail/life-audiodetail',
		});



		const uuid=wx.getStorageSync('uid');
		const stage=wx.getStorageSync('stage');
		wx.request({
			url: this.data.baseurl+"/qcrsPassCallback",
			method: 'POST',
			data:{
				uid:uuid,
				stage:stage,
				pass:1
			},
			success: (res) => {
				// this.setData({
				// 	pass:res.data.data.pass,
				// 	stage:res.data.data.stage,
				// 	clearance2:true
				// });
				const stage2=wx.getStorageSync('stage2');
					const stage=wx.getStorageSync('stage');
					if(stage2==stage&&stage<res.data.data.stage){
						console.log("rdcftvbuhnijk");
						this.setData({
							shareshow:true,
							
						});
					};
				
			}
		});






		
	
	},
	tolifevideodetail(e){
		// this.data.bgaudio.stop();
		let index = e.currentTarget.dataset['index'];
		index =index+1;
		console.log(index);
		wx.setStorage({
			data: index,
			key: 'currentvideolevel',
		}) ;
		wx.navigateTo({
			url: '/pages/life-videodetail/life-videodetail',
		});


		const uuid=wx.getStorageSync('uid');
		const stage=wx.getStorageSync('stage');
		wx.request({
			url: this.data.baseurl+"/qcrsPassCallback",
			method: 'POST',
			data:{
				uid:uuid,
				stage:stage,
				pass:2
			},
			success: (res) => {
				// this.setData({
				// 	pass:res.data.data.pass,
				// 	stage:res.data.data.stage,
				// 	clearance3:true
				// });
				const stage2=wx.getStorageSync('stage2');
					const stage=wx.getStorageSync('stage');
					if(stage2==stage&&stage<res.data.data.stage){
						console.log("rdcftvbuhnijk");
						this.setData({
							shareshow:true,
							
						});
					};
				
			}
		});



		
	},
	onShareAppMessage: function(res) {
    return {
      
      path:'pages/home/home'
    }

	},
	async handleShareTap() {
		this.tapShare = true;
		// let shareRes2 = await ShareCore.call(this, 1);
		const uuid=wx.getStorageSync('uid');
		wx.request({
			url: this.data.baseurl+"/shareCallback",
			method: 'POST',
			data:{
				uid:uuid,
				is_game: 1,
				
			},
			success: (res) => {
				wx.showToast({
					title: res.data.msg,
					icon: 'none',
					duration: 3000,
				});
			}
		})
	}			
})