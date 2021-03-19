import SunnyResult from '../class/sunny';
import ImgSrc from '../config/imgSrc';
import { CDN_BASE_URL } from '../config/URI';

// 答案类型
export const ANSWER_TYPE = {
	RIGHT: 'right',
	ERROR: 'error',
};

// 性别类型
export const SEXTYPE = {
	BOY: 1,
	GIRL: 0,
};

// 答题分类
export const CAT = {
	FOLK: 1,
	ARROW: 2,
	SUN: 3,
	HAPPINESS: 4,
};

// 关卡难度
export const HARD = {
	L1: 1,
	L2: 2,
	L3: 3,
	L4: 4,
	L5: 5,
};

// 弓箭传说中关卡难度对应的头衔
export const RANK_TITLE = ['新手', '弓箭手', '幻影射手', '神箭手', '弓魂'];

// 答案类别转换
export const AnswerT = {
	A: 1,
	B: 2,
	C: 3,
	D: 4,
};

// 进度条倒计时时间
export const DOWN_TIME = 30;

// 民间王者，随机匹配时间（15s）
export const FOLK_RANDOM_TIME = 15;

// 轮训结果
export const TRAIN_STATUS = {
	// 等待对方加入
	WAIT: 1,
	// 开始or正在答题
	START: 2,
	// 房间过期
	EXPIRE: 3,
};

// 双人对战身份标识
export const IDENTIFY = {
	SELF: 1,
	FRIEND: 2,
};

// 游戏配置模式
export const GAME_MODE = {
	RANDOM: 'random',
	FRIEND: 'friend',
};

// 分享标题
export const SHARE_CONTENT = {
	TITLE: '普法总动员，等你来挑战!',
};

// 向阳而生数目发育期配置
export const GROW_TITLE = {
	LEVEL_1: '种子期',
	LEVEL_2: '幼苗期',
	LEVEL_3: '生长期',
	LEVEL_4: '开花期',
	LEVEL_5: '结果期',
};

// 向阳而生种类
export const SUNNY_SOFT_TYPE = {
	SUN: 1,
	WATER: 2,
	FERTILIZER: 3,
	GRASS: 4,
};

// 向阳而生种类中文映射
export const SUNNY_ZH_MAP = {
	1: '洒阳光',
	2: '浇水',
	3: '施肥',
	4: '除草',
};

// 向阳而生选项错误倒计时
export const SUNNY_DOWN_TIME = 15;

// 向阳而生通关一次倒计时, 5分钟 300000  两小时 7200000
export const SUNNY_CHCKEPOINT_TIME = 7200000;

// 使用Map存储向阳而生结果种类
export const SUNNY_MAP = new Map();
// 洒太阳
SUNNY_MAP.set(
	SUNNY_SOFT_TYPE.SUN,
	new SunnyResult(
		'洒阳光成功',
		'洒阳光失败',
		'小树光照不够了,得补充光照了！',
		ImgSrc.SUNNY_SUN_CONTINUE
	)
);
// 浇水
SUNNY_MAP.set(
	SUNNY_SOFT_TYPE.WATER,
	new SunnyResult(
		'浇水成功',
		'浇水失败',
		'小树的水分不够了,得补充水分了！',
		ImgSrc.SUNNY_WATER_CONTINUE
	)
);
// 施肥
SUNNY_MAP.set(
	SUNNY_SOFT_TYPE.FERTILIZER,
	new SunnyResult(
		'施肥成功',
		'施肥失败',
		'小树营养不够了,得补充营养了！',
		ImgSrc.SUNNY_FERTILIZER_CONTINUE
	)
);
// 除草
SUNNY_MAP.set(
	SUNNY_SOFT_TYPE.GRASS,
	new SunnyResult(
		'除草成功',
		'除草失败',
		'小树杂草太多了,得除草了！',
		ImgSrc.SUNNY_GRASS_CONTINUE
	)
);

export const ANSWER_STATUS = {
	// 已作答
	ANSWERED: 1,
	// 超时
	TIMEOUT: 2,
};

// 对应游戏的规则ID
export const GAME_RULE_ID = {
	ARROW: 1,
	FLOW: 2,
	SUNNY: 3,
	HAPPY: 4,
};

// 幸福社区分享
export const AUTH_FAIL = {
	USERINFO: 'USERINFO',
	PHOTO: 'PHOTO',
};

// const CDN_BASE_URL = 'http://lrj.com/miniassets/static';
// 背景音乐配置
export const BGM = {
	// 舒适 弓箭传说 + 向阳而生
	COMFOTABLE: CDN_BASE_URL + '/mp3/comfortable.mp3',
	// 愉悦	民间王者 + 幸福社区
	CHEERFUL: CDN_BASE_URL + '/mp3/cheerful.mp3',
};

// 内部音乐管理器
let MUSIC_MANAGER = wx.createInnerAudioContext();
MUSIC_MANAGER.loop = true;
export { MUSIC_MANAGER };

// 清空内部音乐管理器
export const SET_MUSIC_MANAGER = status => (MUSIC_MANAGER = status);
