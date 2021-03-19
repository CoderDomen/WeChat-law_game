import ImgSrc from '../config/imgSrc';

export default class FlokShare {
	// 用户头像
	avatar = null;

	constructor(avatar) {
		this.avatar = avatar;
		this.title = '法律大作战';
		this.content = '学习民法,从身边点滴开始';
	}


	palette() {

		return {
			width: '1000px',
			height: '1400px',
			background: 'rgba(0,0,0,0)',
			views: [
				// 背景图片
				{
					type: 'image',
					url: ImgSrc.LIFE_SHARE_BG,
					css: {
						width: '1000px',
						height: '1400px',
						top: '0px',
						left: '0px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						mode: 'scaleToFill',
					},
				},
				// logo
				// {
				// 	type: 'image',
				// 	url: ImgSrc.PALETTE_FOLK_LOGO,
				// 	css: {
				// 		width: '200px',
				// 		height: '200px',
				// 		top: '1180px',
				// 		left: '29px',
				// 		rotate: '0',
				// 		borderRadius: '20px',
				// 		borderWidth: '',
				// 		borderColor: '#000000',
				// 		shadow: '',
				// 		mode: 'scaleToFill',
				// 	},
				// },
				{
					type: 'text',
					text: this.title,
					css: {
						color: '#fff',
						background: 'rgba(0,0,0,0)',
						width: '668px',
						height: '70.785px',
						top: '1215px',
						left: '29px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						padding: '0px',
						fontSize: '49.5px',
						fontWeight: 'normal',
						maxLines: '2',
						lineHeight: '71.42850000000001px',
						textStyle: 'fill',
						textDecoration: 'none',
						fontFamily: '',
						textAlign: 'left',
					},
				},
				{
					type: 'text',
					text: this.content,
					css: {
						color: 'rgba(255,255,255, 0.6)',
						background: 'rgba(0,0,0,0)',
						width: '668px',
						height: '55.769999999999996px',
						top: '1300px',
						left: '29px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						padding: '0px',
						fontSize: '39px',
						fontWeight: 'normal',
						maxLines: '2',
						lineHeight: '56.27700000000001px',
						textStyle: 'fill',
						textDecoration: 'none',
						fontFamily: '',
						textAlign: 'left',
					},
				},
				{
					type: 'image',
					url: ImgSrc.PALETTE_FOLK_CODE,
					css: {
						width: '218px',
						height: '218px',
						top: '1143px',
						left: '744px',
						rotate: '0',
						borderRadius: '13px',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						mode: 'scaleToFill',
					},
				},
				// 头像部分
				{
					type: 'image',
					url: this.avatar,
					css: {
						width: '226px',
						height: '226px',
						top: '112px',
						left: '389px',
						rotate: '0',
						borderRadius: '234px',
						borderWidth: '8px',
						borderColor: '#FDD954',
						shadow: '',
						mode: 'scaleToFill',
					},
				},
				// 王冠
				{
					type: 'image',
					url: ImgSrc.PALETTE_FOLK_CROWN,
					css: {
						width: '99px',
						height: '75px',
						top: '67px',
						left: '385px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '',
						shadow: '',
						mode: 'scaleToFill',
					},
				},
			],
		};
	}
}
