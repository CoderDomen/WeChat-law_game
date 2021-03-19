import ImgSrc from '../config/imgSrc';
// import { getImgSrc } from '../utils/util';

const src = Symbol('getImgSrc');

export default class FlokShare {
	// 用户头像
	avatar = null;
	// 用户分数
	score = null;
	IMG_BG = null;
	IMG_LOGO = null;
	IMG_CODE = null;
	IMG_CROWN = null;
	IMG_ICON = null;

	constructor(avatar, score = 100) {
		this.avatar = avatar;
		this.score = score;

		this.title = '法律大作战';
		this.content = '学习民法,从身边点滴开始';
		this.ch = '获得称号:民间王者';
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
					url: ImgSrc.PALETTE_FOLK_BG,
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
				{
					type: 'image',
					url: ImgSrc.PALETTE_FOLK_LOGO,
					css: {
						width: '200px',
						height: '200px',
						top: '1180px',
						left: '29px',
						rotate: '0',
						borderRadius: '20px',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						mode: 'scaleToFill',
					},
				},
				{
					type: 'text',
					text: this.title,
					css: {
						color: '#fff',
						background: 'rgba(0,0,0,0)',
						width: '668px',
						height: '70.785px',
						top: '1215px',
						left: '250px',
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
						left: '250px',
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
					type: 'rect',
					css: {
						background: '#fff',
						width: '249px',
						height: '249px',
						top: '1124px',
						left: '728px',
						rotate: '0',
						borderRadius: '13px',
						shadow: '',
						color: '#fff',
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
				{
					type: 'rect',
					css: {
						background: '#2C75E3',
						width: '668px',
						height: '124px',
						top: '438px',
						left: '185px',
						rotate: '0',
						borderRadius: '13px',
						shadow: '',
						color: '#2C75E3',
					},
				},
				// 图标
				{
					type: 'image',
					url: ImgSrc.PALETTE_FOLK_ICON,
					css: {
						width: '138px',
						height: '181px',
						top: '414px',
						left: '141px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '',
						shadow: '',
						mode: 'scaleToFill',
					},
				},
				// 后面需要根据成绩转换
				{
					type: 'text',
					text: this.ch,
					css: {
						color: '#FFF5A1',
						background: 'rgba(0,0,0,0)',
						width: '668px',
						height: '85.79999999999998px',
						top: '460px',
						left: '293px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						padding: '0px',
						fontSize: '60px',
						fontWeight: 'normal',
						maxLines: '2',
						lineHeight: '86.58000000000001px',
						textStyle: 'fill',
						textDecoration: 'none',
						fontFamily: '',
						textAlign: 'left',
					},
				},
				// 成绩
				{
					type: 'text',
					text: `成绩:${this.score}分`,
					css: {
						color: '#FFFFFF',
						background: 'rgba(0,0,0,0)',
						width: '668px',
						height: '100.09999999999998px',
						top: '609px',
						left: '318px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						padding: '0px',
						fontSize: '70px',
						fontWeight: 'normal',
						maxLines: '2',
						lineHeight: '101.01000000000002px',
						textStyle: 'fill',
						textDecoration: 'none',
						fontFamily: '',
						textAlign: 'left',
					},
				},
			],
		};
	}
}
