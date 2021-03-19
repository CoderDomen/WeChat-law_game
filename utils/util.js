import { AnswerT, HARD, SEXTYPE, GROW_TITLE, SHARE_CONTENT } from '../config/config';
import UserModel from '../model/userModel';
import Store from '../model/storeModel';
import { CDN_BASE_URL as BASE_URL } from '../config/URI';
import { AddImgRes } from '../config/imgSrc';
import CommonModel from '../model/commonModel';

const um = new UserModel();

/**
 * 动态获取小程序导航栏高度
 * @returns {any}
 */
function CustromMenuButtonBoundingClientRect() {
	let systemInfo = wx.getSystemInfoSync();
	let rect = null;
	try {
		rect = Taro.getMenuButtonBoundingClientRect
			? Taro.getMenuButtonBoundingClientRect()
			: null;
		if (rect === null) {
			throw 'getMenuButtonBoundingClientRect error';
		}
		//取值为0的情况
		if (!rect.width) {
			throw 'getMenuButtonBoundingClientRect error';
		}
		//取值为0的情况
		if (!rect.width) {
			throw 'getMenuButtonBoundingClientRect error';
		}
	} catch (error) {
		let gap = ''; //胶囊按钮上下间距 使导航内容居中
		let width = 96; //胶囊的宽度，android大部分96，ios为88
		if (systemInfo.platform === 'android') {
			gap = 8;
			width = 96;
		} else if (systemInfo.platform === 'devtools') {
			if (systemInfo.system.includes('ios')) {
				gap = 5.5; //开发工具中ios手机
			} else {
				gap = 7.5; //开发工具中android和其他手机
			}
		} else {
			gap = 4;
			width = 88;
		}
		if (!systemInfo.statusBarHeight) {
			//开启wifi的情况下修复statusBarHeight值获取不到
			systemInfo.statusBarHeight =
				systemInfo.screenHeight - systemInfo.windowHeight - 20;
		}
		rect = {
			//获取不到胶囊信息就自定义重置一个
			bottom: systemInfo.statusBarHeight + gap + 32,
			height: 32,
			left: systemInfo.windowWidth - width - 10,
			right: systemInfo.windowWidth - 10,
			top: systemInfo.statusBarHeight + gap,
			width: width,
		};
	}
	return rect;
}

// 导航栏 + 系统状态栏高度
function getBarHeight() {
	const app = getApp();
	let offsetTop = app.globalData.navBarHeight + app.globalData.top;
	return offsetTop;
}

/**
 * 对问题答案进行转换
 * @param {any} ans
 * @returns {any}
 */
function transformAnswer(ans) {
	console.log(AnswerT[ans.trim().toUpperCase()]);
	// return AnswerT[ans.trim().toUpperCase()] || ans;
	return ans;
}

/**
 * 判断用户状态, 未注册才会有返回结果
 * @returns {any}
 */
async function checkUserStatus() {
	let result = '';
	// 判断缓存中有无uid
	// 没有uid
	if (!UserModel.hasUid()) {
		let loginRes = await um.login();

		if (loginRes.successed && loginRes.openId) {
			loginRes = await register(loginRes.openId);
			result = {
				type: 'first',
				login: true,
				data: loginRes,
			};
		} else if (loginRes.successed && loginRes.uid) {
			// 登录成功
			UserModel.setUid(loginRes.uid);

			result = {
				login: true,
				data: loginRes,
			};
		}
	} else {
		// 登录操作
		let loginRes = await um.login();
		if (loginRes.successed && loginRes.openId) {
			// 清空所有缓存
			Store.clearCache();
			loginRes = await register(loginRes.openId);
			result = {
				login: true,
				data: loginRes,
			};
		}
		if (loginRes.successed && loginRes.uid) {
			// 登录成功
			result = {
				login: true,
				data: loginRes,
			};
		}
	}
	checkCacheUserInfo();
	return result;
}

/**
 * 注册操作
 * @returns {any}
 */
async function register(openId) {
	// 未注册
	let registeRes = await um.register({ openId });
	console.log('注册消息',registeRes);
	if (registeRes.successed) {
		registeRes.uid && UserModel.setUid(registeRes.uid);
		// 再登录一次
		let loginRes = await um.login();
		if (loginRes.successed && loginRes.uid) {
			return loginRes;
		}
	} else {
		wx.showToast({
			title: registeRes.msg,
			icon: 'none',
		});
	}
}

/**
 * 检查用户信息的缓存状态
 * @returns {any}
 */
function checkCacheUserInfo() {
	// 缓存用户信息部分
	if (!UserModel.getUserInfo()) {
		wx.getUserInfo({
			lang: 'zh_CN',
			success: res => {
				let { userInfo } = res;
				UserModel.setUserInfo(userInfo);
				Store.set('timestamp', +new Date() + 7 * 1000 * 3600 * 24);
			},
		});
	}
	const timestamp = Store.get('timestamp');
	if (timestamp && +new Date() > timestamp) {
		wx.getUserInfo({
			lang: 'zh_CN',
			success: res => {
				let { userInfo } = res;
				UserModel.setUserInfo(userInfo);
				// 一个星期更新信息一次，如果经常使用的话
				Store.set('timestamp', +new Date() + 7 * 1000 * 3600 * 24);
				userInfo.userId = UserModel.hasUid();
				um.updateInfo(userInfo);
			},
		});
	}
}

/**
 * 	针对性别加载不同等级和图片，弓箭传说， 需要等级，读取api数据
 * @param {any} sexType
 * @param {any} rank=1
 * @returns {any}
 */
function checkGongAvatar(sexType, rank = 1) {
	let src = '';
	if (sexType === SEXTYPE.BOY || sexType === SEXTYPE.GIRL) {
		sexType = sexType === SEXTYPE.BOY ? 'boy' : 'girl';
		src = BASE_URL + `/components/arrow-legend/icon_${sexType}_${rank}.png`;
	}
	AddImgRes('ARROW_RANK_PERSON', src);
	return src;
}

/**
 * 匹配难度
 * @param {any} hard
 * @returns {any}
 */
function matchHard(hard) {
	switch (hard) {
		case HARD.L1:
			return HARD.L1;
		case HARD.L2:
			return HARD.L2;
		case HARD.L3:
			return HARD.L3;
		case HARD.L4:
			return HARD.L4;
		case HARD.L5:
			return HARD.L5;
		default:
			return HARD.L1;
	}
}

/**
 * 检查工作环境
 * @returns {any}
 */
function checkEnviroment() {
	const {
		miniProgram: { envVersion = 'release' },
	} = wx.getAccountInfoSync();
	let env = 'prod';
	if (envVersion === 'develop') {
		// 工具或者真机 开发环境
		env = 'dev';
	} else if (envVersion === 'trial') {
		// 测试环境(体验版)
		env = 'dev';
	} else if (envVersion === 'release') {
		// 正式环境
		env = 'prod';
	}
	return env;
	// return 'prod';
}

/**
 * 匹配发育标题
 * @param {any} grow	发育阶段
 * @returns {any}
 */
function matchGrowTitle(grow) {
	switch (grow) {
		case 0:
		case 1:
			return GROW_TITLE.LEVEL_1;
		case 2:
			return GROW_TITLE.LEVEL_2;
		case 3:
			return GROW_TITLE.LEVEL_3;
		case 4:
			return GROW_TITLE.LEVEL_4;
		case 5:
			return GROW_TITLE.LEVEL_5;
		default:
			return GROW_TITLE.LEVEL_1;
	}
}

/**
 * 获取图片信息，封装promise
 * @param {any} src	图片地址
 * @returns {any}
 */
function getImgSrc(src) {
	return new Promise(resolve => {
		wx.getImageInfo({
			src,
			success: res => {
				resolve(res.path);
			},
		});
	}).catch(_ => {
		wx.showToast({
			title: '发生错误',
			icon: 'none',
		});
	});
}


/**
 * 普通页面分享
 * @returns {any}
 */
async function ShareCore(type) {
	const common = new CommonModel();
	let shareRes = await common.shareReward(UserModel.hasUid(), type);
	if (shareRes.successed) {
		if(shareRes.msg) {
			wx.showToast({
				title: shareRes.msg,
				icon: 'none',
			});
		}
		if(shareRes.coin && shareRes.take_count) {
			const elseInfo = Store.get('user');
			UserModel.updateCacheUser('coin', elseInfo.coin + shareRes.coin);
			UserModel.updateCacheUser('shield', elseInfo.shield + shareRes.take_count);
		}
	} else {
		wx.showToast({
			title: shareRes.msg || '分享奖励失败',
			icon: 'none',
		});
	}
}

/**
 * 普通分享回调内容
 * @returns {any}
 */
async function normalShareContent() {
	return {
		title: SHARE_CONTENT.TITLE,
		path: '/pages/index/index',
	};
}

export {
	CustromMenuButtonBoundingClientRect,
	getBarHeight,
	transformAnswer,
	checkUserStatus,
	checkCacheUserInfo,
	checkGongAvatar,
	matchHard,
	checkEnviroment,
	matchGrowTitle,
	getImgSrc,
	ShareCore,
	normalShareContent
};
