import navBev from '../../behaviors/behavior';
import ImgBev from '../../behaviors/imgBev';
import ImgRes from '../../config/config';
import { IDENTIFY, GAME_MODE } from '../../config/config';
import UserModel from '../../model/userModel';
import Store from '../../model/storeModel';
import { ShareCore, normalShareContent } from '../../utils/util';
import { PRO_BASE_URL } from '../../config/URI';
var myaudio = wx.createInnerAudioContext({});
		myaudio.src="https://cdn.static.sifa.prod.hello4am.com/mp3/comfortable.mp3";
Page({
	isShare: false,
	behaviors: [navBev, ImgBev],
	data: {
		age:'',
		// baseurl:"https://sifa.prod.hello4am.com",
		baseurl:PRO_BASE_URL,
		// uid:wx.getStorage({
		// 	key: 'uid',
		// 	success (res) {
		// 	console.log(res.data)
		// 	}
		// 	})
		uid:'',
		scrollTop: 0,//控制上滑距离
		windowHeight: 0,//页面高度
		myaudio:''
	},
	   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      windowHeight: height
    })
    this.pageScrollToBottom();
  },
 
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function() {
    var that = this;
    var height = wx.getSystemInfoSync().windowHeight;
    wx.createSelectorQuery().select('#page').boundingClientRect(function(rect) {
      if (rect){
        that.setData({
          windowHeight: height,
          scrollTop: rect.height
        })
      }
    }).exec()
  },
	onLoad() {
		this._loadImgSrc();
		this.setData({
      musicbtn: true
    });
		const uuid=wx.getStorageSync('uid');
			// this.data.uid=uuid;
			console.log(uuid);
    wx.request({
			url: this.data.baseurl+"/getQcrsInfo",
			method: 'GET',
			data:{
				uid:uuid
			},
			success: (res) => {
				this.setData({
						age:res.data.data.qcrs.qcrs_stage,
				});
				wx.setStorage({
					data: res.data.data.qcrs.qcrs_pass,
					key: 'pass',
				});
				wx.setStorage({
					data: res.data.data.qcrs.qcrs_stage,
					key: 'stage',
				});
				// wx.setStorage({
				// 	data: res.data.data.qcrs_pass_media,
				// 	key: 'qcrs_pass_media',
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
		
		myaudio.play();
		myaudio.onEnded((res)=> {
		myaudio.play();
		});
		wx.getStorage({
      key: 'stage',
      success: (res) =>{
        this.setData({
          age:res.data
				});
      }
		});
		

		const uuid=wx.getStorageSync('uid');
			// this.data.uid=uuid;
			console.log(uuid);
    wx.request({
			url: this.data.baseurl+"/getQcrsInfo",
			method: 'GET',
			data:{
				uid:uuid
			},
			success: (res) => {
				this.setData({
						age:res.data.data.qcrs.qcrs_stage,
				});
				wx.setStorage({
					data: res.data.data.qcrs.qcrs_pass,
					key: 'pass',
				});
				wx.setStorage({
					data: res.data.data.qcrs.qcrs_stage,
					key: 'stage',
				});
				// wx.setStorage({
				// 	data: res.data.data.qcrs_pass_media,
				// 	key: 'qcrs_pass_media',
				// });
				console.log(res.data);
			},
		});
	},
	
	onHide: function () {
    myaudio.pause();
		this.setData({
      musicbtn: true
    });
  },
  // 导航栏返回
	handleNavBack() {
		myaudio.pause();
		wx.redirectTo({   
      url:"/pages/home/home"
   })
	},

	handle() {
		wx.navigateTo({
			url: '/pages/life-detail/life-detail',
		});
		wx.setStorage({
			data: 1,
			key: 'stage2',
		})
	},
	handle2() {
		wx.navigateTo({
			url: '/pages/life-detail/life-detail',
		});
		wx.setStorage({
			data: 2,
			key: 'stage2',
		})
	},
	handle3() {
		wx.navigateTo({
			url: '/pages/life-detail/life-detail',
		});
		wx.setStorage({
			data: 3,
			key: 'stage2',
		})
	},
	handle4() {
		wx.navigateTo({
			url: '/pages/life-detail/life-detail',
		});
		wx.setStorage({
			data: 4,
			key: 'stage2',
		})
	},
	handle5() {
		wx.navigateTo({
			url: '/pages/life-detail/life-detail',
		});
		wx.setStorage({
			data: 5,
			key: 'stage2',
		})
	},
	handle6() {
		wx.navigateTo({
			url: '/pages/life-detail/life-detail',
		});
		wx.setStorage({
			data: 6,
			key: 'stage2',
		})
	},
	handle7() {
		wx.navigateTo({
			url: '/pages/life-detail/life-detail',
		});
		wx.setStorage({
			data: 7,
			key: 'stage2',
		})
	},
	musicplay(){
		myaudio.pause();
		this.setData({
      musicbtn: false
    });
	},
	musicpause(){
		myaudio.play();
		this.setData({
      musicbtn: true
    });
	}
})