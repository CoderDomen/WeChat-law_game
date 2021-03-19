
export const APPID = {
	goodsDevAppId: 'wxdd4bebc8c4b9217e',
	JUDICIAL: 'wx5129014ec0d1fa55',
};

// 数据接口基地址
// export const PRO_BASE_URL = 'https://sifa.dev.hello4am.com';
export const PRO_BASE_URL = 'https://sifa.prod.hello4am.com';
export const DEV_BASE_URL = 'http://yapi.ktvit.cn';
export const CDN_BASE_URL = 'https://cdn.static.sifa.prod.hello4am.com';

export const BASE_URL = (() => {
	const appid = wx.getAccountInfoSync().miniProgram.appId;
	return appid === APPID.goodsDevAppId ? DEV_BASE_URL : PRO_BASE_URL;
})();

// 好货附近购
// 小程序id和秘钥
// const PROGROM_CONFIG = {
// 	ID: 'wxdd4bebc8c4b9217e',
// 	SECRET: '80d6296baf8bc074fffe8edb47575480',
// };

// 司法
// const PROGROM_CONFIG = {
// 	ID: 'wx5129014ec0d1fa55',
// 	SECRET: '464137c68ed1414f927b2a38ed495100',
// };

// openid地址
// export const OpenIdUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${PROGROM_CONFIG.ID}&secret=${PROGROM_CONFIG.SECRET}&js_code=%s&grant_type=authorization_code`;