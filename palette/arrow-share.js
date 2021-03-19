import {SEXTYPE} from '../config/config';
import ImgSrc from '../config/imgSrc';

export default class ArrowShare {
	// 头像
	avatar = null;
	// 昵称
	nickName = null;
	// 性别
	gender = null; // 默认为男

	constructor(avatar, nickName, gender = SEXTYPE.BOY) {
		this.avatar = avatar;
		this.nickName = nickName;
		this.gender = gender;

		this.content = '学习宪法，从你我做起';
	}

	palette() {
		return {
			width: '1000px',
			height: '1323px',
			background: 'rgba(0,0,0,0)',
			views: [
				{
					type: 'image',
					url: this.gender === SEXTYPE.BOY ? ImgSrc.PALETTE_ARROW_BG_BOY : ImgSrc.PALETTE_ARROW_BG_GIRL,
					css: {
						width: '1000px',
						height: '1323px',
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
				// 头像
				{
					type: 'image',
					url: this.avatar,
					css: {
						width: '180px',
						height: '180px',
						top: '1106.5px',
						left: '76px',
						rotate: '0',
						borderRadius: '180px',
						borderWidth: '8px',
						borderColor: '#fff',
						shadow: '',
						mode: 'scaleToFill',
					},
				},
				// 昵称
				{
					type: 'text',
					text: this.nickName,
					css: {
						color: '#fff',
						background: 'rgba(0,0,0,0)',
						width: '668px',
						height: '70.785px',
						top: '1127px',
						left: '275px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						padding: '0px',
						fontSize: '49.5px',
						fontWeight: 'bold',
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
						color: '#fff',
						background: 'rgba(0,0,0,0)',
						width: '668px',
						height: '60.059999999999995px',
						top: '1201.5px',
						left: '275px',
						rotate: '0',
						borderRadius: '',
						borderWidth: '',
						borderColor: '#000000',
						shadow: '',
						padding: '0px',
						fontSize: '42px',
						fontWeight: 'normal',
						maxLines: '2',
						lineHeight: '60.60600000000001px',
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
