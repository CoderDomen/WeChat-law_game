// 使用预加载图片公共behavior
import ImgSrc from '../config/imgSrc';
const ImgBev = Behavior({
    data: {
        ImgRes: null
    },

    attached() {
        this._loadImgSrc();
    },

	methods: {
        _loadImgSrc() {
            if(ImgSrc) {
                this.setData({
                    ImgRes: ImgSrc
                })
            }
        }
	},
});

export default ImgBev;
