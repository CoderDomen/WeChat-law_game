import { BASE_URL } from '../config/URI';

export default {
    // 登录
    LOGIN: BASE_URL + '/wechat/miniLogin',
    // 注册
    REGISTER: BASE_URL + '/wechat/miniReg',
    // 更新用户信息
    UPDATE_USER_INFO: BASE_URL + '/users',
    QUESTION: {
        // 获取题目
        GET: BASE_URL + '/getQuestion'
    },
    // 加入房间
    JOIN_ROOM: BASE_URL + '/join_room',
    // 创建房间
    CREATE_ROOM: BASE_URL + '/create_pk',
    // 轮训房间状态
    CHECK_ROOM_STATUS: BASE_URL + '/pkRoomStatus',
    // 双人答题上传分数
    UPLOAD_SCORE: BASE_URL + '/updatePkRoomScore',
    // 签到
    SIGN: BASE_URL + '/signUp',
    // 获取签到
    GET_SIGN: BASE_URL + '/getSignUp',
    // 单人上传答案
    UPLOAD_SCORE_SINGE: BASE_URL + '/updateScore',
    // 分享奖励接口
    SHARE_REWARD: BASE_URL + '/shareCallback',
    // 看完视频奖励接口
    VIDEO_END_REWARD: BASE_URL + '/videoCallback',
    // 视频地址
    VIDEO_SRC: BASE_URL + '/sourcelist',
    // 获取用户其他信息（阅读次数，体验次数，通关次数）
    ELSE_INFO: BASE_URL + '/getUserCount',
    // 视频点击回调
    VIDEO_CLICK: BASE_URL + '/videoClickCallback',
    // 游戏玩法
    GAME_RULE: BASE_URL + '/gameRule',
    // 获取一级建筑
    FIRST_BUILD: BASE_URL + '/getBuild',
    // 获取二级建筑
    SECOND_BUILD: BASE_URL + '/getSubBuild',
    // 获取解锁过的二级建筑
    MY_UNLOCK_BUILD: BASE_URL + '/getMyBuild',
    // 解锁二级建筑
    UNLOCK_BUILD: BASE_URL + '/unlockBuild',
    // 赛度奖励
    ACTIVITY_PRICE: BASE_URL + '/getAwardInfo',
    // 获取向阳闯关进度
    TREE_STATUS: BASE_URL + '/getTreeStage',
    // 播下种子
    PUT_SEED: BASE_URL + '/putSeed'
}