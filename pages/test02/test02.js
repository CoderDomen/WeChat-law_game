// import FolkShare from '../../palette/folk-share';
// import ArrowShare from '../../palette/arrow-share';
// import SunnyShare from '../../palette/sunny-share';
import HappyShare from '../../palette/happy-share';
import NavBev from '../../behaviors/behavior';
import ImgSrc, { LOCAL_IMAGES_SRC } from '../../config/imgSrc';
import { MUSIC_MANAGER } from '../../config/config';

// src/pages/xml2can/xml2can.js
Page({
  imagePath: '',
  history: [],
  future: [],
  isSave: false,


  behaviors: [NavBev],
  /**
   * 页面的初始数据
   */
  data: {
    template: {},
    FolkImage: null,
    ArrowImage: null,
    modal: false,
    bgSrc: ImgSrc.ARROW_RANK_BG,
    bgLoad: true
  },

  onLoad() {
    console.log(MUSIC_MANAGER.src)
    MUSIC_MANAGER.src = 'http://m8.music.126.net/20200821102325/d68a6d44329b77d240695dd1fe014d21/ymusic/0f58/5358/5509/8256c318c5d2ac21d23bbcac7d93b04d.mp3'
    MUSIC_MANAGER.play();
  },

  // 返回时的回调函数
  handleComfirm() {
    this.setData({
      modal: false
    })
  },

  onImgOK(e) {
    this.imagePath = e.detail.path;
    
    this.setData({
      FolkImage: this.imagePath,
    })
  },

  handlePreview() {
    wx.previewImage({
      urls: [this.data.FolkImage],
    })
  },

  // 图片加载完成
  handleLoad() {
    this.setData({
      bgLoad: true
    })
  },

  // 切换背景
  toggleBg() {
    if(this.data.bgSrc === ImgSrc.ARROW_RANK_BG) {
      this.setData({
        bgSrc: LOCAL_IMAGES_SRC.ALL_BG_WHITE
      })
      return;
    }
    this.setData({
      bgSrc: ImgSrc.ARROW_RANK_BG
    })
  },
  // 保存图片
  saveImage(imagePath = '') {
    console.log(imagePath);
    console.log(this.data.FolkImage);
    wx.saveImageToPhotosAlbum({
      filePath: this.data.FolkImage,
      success: res => {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
      },
      fail: (err) => {
        console.log(err);
        if(
          err.errMsg.includes('fail auth deny') 
          || 
          err.errMsg.includes('fail authorize no response')) {
          this.setData({
            modal: true
          })
        }
      }
    });
  },

  getUserAuthorize() {
    wx.getSetting({
      success: res => {
        console.log(res);
      }
    })
  },

  onReady: function() {
    this.setData({
      paintPallette: new HappyShare(ImgSrc.HOME_AVATAR, '卢浮公').palette()
    });
  },
});
