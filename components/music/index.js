import {
	BGM,
	CAT,
	MUSIC_MANAGER,
} from '../../config/config';
import { LOCAL_IMAGES_SRC } from '../../config/imgSrc';
import Store from '../../model/storeModel';

Component({
	properties: {
		type: Number,
		destory: {
			type: Boolean,
			value: false,
		},
	},

	observers: {
		type(val) {
			if (val) {
				switch (val) {
					case CAT.ARROW:
					case CAT.SUN:
						if (MUSIC_MANAGER.src !== BGM.COMFOTABLE) {
							MUSIC_MANAGER.src = BGM.COMFOTABLE;
						}
						break;
					case CAT.FOLK:
					case CAT.HAPPINESS:
						if (MUSIC_MANAGER.src !== BGM.CHEERFUL) {
							MUSIC_MANAGER.src = BGM.CHEERFUL;
						}
						break;
				}
				if (!Store.get('happy_music')) {
					this._play();
				}
			}
		},
		destory(val) {
			console.log('destory -- music');
			if (val) {
				if (
					this.properties.type === CAT.HAPPINESS ||
					this.properties.type === CAT.SUN
				) {
					this._clearTag();
				}
				MUSIC_MANAGER.stop();
			}
		},
	},

	data: {
		status: LOCAL_IMAGES_SRC.MUSIC_PLAY,
		play: false,
		// audio 实例
		audio: null,
	},

	pageLifetimes: {
		show() {
			console.log('show -- music');
			if (Store.get('happy_music')) {
				console.log('pause');
				this._pause();
			} else {
				console.log('play');
				this._play();
			}
		},
	},
	methods: {
		// 切换播放状态
		toggleStatus() {
			if (this.data.play) {
				this._pause();
			} else {
				this._play();
			}
		},

		// 播放音乐
		_play() {
			this.setData({
				play: true,
				status: LOCAL_IMAGES_SRC.MUSIC_PLAY,
			});
			this._clearTag();
			MUSIC_MANAGER.play();
		},
		// 停止播放
		_pause() {
			this.setData({
				play: false,
				status: LOCAL_IMAGES_SRC.MUSIC_PASUSE,
			});
			this._setTag();
			MUSIC_MANAGER.pause();
		},

		// 清楚幸福社区暂停标志
		_clearTag() {
			Store.remove('happy_music');
		},

		// 幸福社区暂停标志
		_setTag() {
			Store.set('happy_music', 1);
		},
	},
});
