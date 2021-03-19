import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import ImgRes from '../../config/config';
import { IDENTIFY, GAME_MODE } from '../../config/config';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { ShareCore, normalShareContent } from '../../utils/util';
import { PRO_BASE_URL } from '../../config/URI';

Page({
	isShare: false,
	behaviors: [navBev, ImgBev],
	data: {
		age:'',
		// baseurl:"https://sifa.prod.hello4am.com",
		baseurl:PRO_BASE_URL,
		uid:'',
    myaudio:'',
    vidoeallurl:'',
		newUrlArr:'',
		newUrlArr2:'',
    videoContext:'',
    nowplayingvideo:1,
	},
	   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
 

  
  
	onLoad() {
		this._loadImgSrc();
		this.setData({
      musicbtn: true,
      listnumber:1,
    });
		const currentvideolevel=wx.getStorageSync('currentvideolevel');
    const stage2=wx.getStorageSync('stage2');
    const uuid=wx.getStorageSync('uid');
    wx.request({
			url: this.data.baseurl+"/getQcrsPassInfo",
			method: 'GET',
			data:{
        currentPass:currentvideolevel,
        stage:stage2,
        uid:uuid
			},
			success: (res) => { 
				this.data.newUrlArr = res.data.data.passInfo.newUrlArr;
				this.data.newUrlArr2 = JSON.parse(JSON.stringify(this.data.newUrlArr));
				var newUrlArr = res.data.data.passInfo.newUrlArr;
				newUrlArr.forEach(item => {
					if(item.title.length > 12){
						item.title = item.title.substring(0,11)+"...";
					}
					if(item.note.length > 24){
						item.note = item.note.substring(0,23)+"...";
					}
				});
        var url = JSON.parse(res.data.data.passInfo.url);
        console.log(url);
        this.data.vidoeallurl = url;
        this.data.videoContext  = wx.createVideoContext('video');
        // this.data.videoContext.pause();
				this.setData({
          mp4src:url[0].url,
					knows:newUrlArr,
					playingvideotitle:this.data.newUrlArr2[0].title,
        });
        // this.data.videoContext  = wx.createVideoContext('video');
        // this.data.videoContext.pause();
		    // videoContext.play();
				// wx.setStorage({
				// 	data: res.data.data.qcrs.qcrs_pass,
				// 	key: 'pass',
				// });
				// wx.setStorage({
				// 	data: res.data.data.qcrs.qcrs_stage,
				// 	key: 'stage',
				// });
				console.log(res.data);
			},
		})
    //获取存储信息
    // wx.getStorage({
    //   key: 'storage',
    //   success: function(res){
    //     // success
    //     this.setData({
    //       age:5
    //     })
    //   }
		// })
		
	},
	onShow(){
		
	},
	
	onHide: function () {
    this.data.myaudio.pause();
		this.setData({
      musicbtn: true
    });
  },
  // 导航栏返回
	handleNavBack() {
		this.data.myaudio.pause();
		wx.navigateTo({   
      url:"/pages/home/home"
   })
  },
  handleEnd(){
		console.log("视频播放结束");
		const uuid=wx.getStorageSync('uid');
		const stage=wx.getStorageSync('stage');
		const currentvideolevel=wx.getStorageSync('currentvideolevel');
		wx.request({
			url: this.data.baseurl+"/qcrsPassCallback",
			method: 'POST',
			data:{
				uid:uuid,
				stage:stage,
        pass:currentvideolevel,
        passMedia:this.data.nowplayingvideo - 1,
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
        
        const uuid=wx.getStorageSync('uid');
				const currentvideolevel=wx.getStorageSync('currentvideolevel');
        wx.request({
          url: this.data.baseurl+"/getQcrsPassInfo",
          method: 'GET',
          data:{
            currentPass:currentvideolevel,
            stage:stage2,
            uid:uuid
          },
          success: (res) => {
          
            var newUrlArr = res.data.data.passInfo.newUrlArr;
            
            this.setData({
            
              knows:newUrlArr
            });
          }
        })

			},
		
		})
	},
  handleSelect(e){
		var videourlindex = e.currentTarget.dataset.videoindex;
		// var title = e.currentTarget.dataset.title;
		var title = this.data.newUrlArr2[videourlindex].title;
    var playvideourl = this.data.vidoeallurl[videourlindex].url;
    this.data.nowplayingvideo = videourlindex + 1;
    this.setData({
      mp4src:playvideourl,
			listnumber:videourlindex + 1,
			videoshow:true,
			playingvideotitle:title,
    });
    this.data.videoContext.stop();
    this.data.videoContext.play();
    // setTimeout(function(){ this.data.videoContext.play(); }, 500);　
    
  },
  
  handlevideoplay(){
    
		this.setData({
			videoshow:true,
			
		});
		
		this.data.videoContext.play();
	},
	
	
})