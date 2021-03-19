import Http from '../api/http';
import URL from '../api/url';
import {
    CDN_BASE_URL
} from '../config/URI';

class CommonModel extends Http {

    /**
     * 签到
     * @param {any} uid 用户id
     * @returns {any}
     */
    async signIn(uid) {
        let signInRes = await this.request({
            url: URL.SIGN,
            method: 'POST',
            data: {
                uid
            }
        });
        return signInRes.data;
    }

    /**
     * 获取签到信息
     * @param {any} uid 用户id
     * @returns {any}
     */
    async getSign(uid) {
        let signRes = await this.request({
            url: URL.GET_SIGN,
            data: {
                uid
            }
        })
        if (signRes.data.code === 404) {
            wx.showToast({
                title: '发生错误了',
                icon: 'none'
            });
            return;
        }
        return signRes.data
    }

    /**
     * 分享奖励接口
     * @param {any} uid 用户id
     * @returns {any}
     */
    async shareReward(uid, is_game = 0) {
        const shareRes = await this.request({
            url: URL.SHARE_REWARD,
            method: 'POST',
            data: {
                uid,
                is_game
            }
        })
        return shareRes.data;
    }

    /**
     * 视频奖励接口
     * @param {any} uid 用户id
     * @returns {any}
     */
    async videoReward(uid, vid) {
        const videoRes = await this.request({
            url: URL.VIDEO_END_REWARD,
            method: 'POST',
            data: {
                uid,
                vid
            }
        })
        return videoRes.data
    }


    /**
     * 视频点击
     * @param {String} uid
     * @param {String} vid
     * @returns {any}
     */
    async videoClick(uid, vid) {
        const clickRes = await this.request({
            url: URL.VIDEO_CLICK,
            method: 'POST',
            data: {
                uid,
                vid
            }
        })
        return clickRes.data
    }

    /**
     * 获取视频地址
     * @returns {any}
     */
    async getVideoSrc() {
        let videoRes = await this.request({
            url: URL.VIDEO_SRC
        });
        return videoRes.data
    }

    /**
     * 获取游戏规则
     * @returns {any}
     * @param {number} type 游戏类型id
     */
    async getGameRule(type) {
        const gameRuleRes = await this.request({
            url: URL.GAME_RULE
        });
        let result = null;
        if (!gameRuleRes.data.successed) {
            result = false;
        } else {
            gameRuleRes.data.doc.forEach(d => {
                if (d.id === type) {
                    result = d.rule.replace(/\<\/?\w*\>/g, '');
                }
            })
        }
        return result;
    }

    // 获取社区首页图片
    async getHappyHomeImg() {
        let imgRes = await this.request({
            url: URL.FIRST_BUILD
        });
        if (imgRes.data.successed && imgRes.data.data && imgRes.data.data.length) {
            imgRes.data.data.forEach(item => {
                item.img2 = CDN_BASE_URL + '/' + item.img2;
                item.img3 = CDN_BASE_URL + '/' + item.img3;
                item.imgSrc = CDN_BASE_URL + '/' + item.imgSrc;
            });
            return imgRes;
        } else {
            wx.showToast({
                title: '发生错误',
                icon: 'none'
            })
        }
    }

    /**
     * 获取二级建筑图
     * @param {any} id
     * @returns {any}
     */
    async getHappyDetailImg(id) {
        let detailRes = await this.request({
            url: URL.SECOND_BUILD,
            data: {
                pid: id
            }
        });
        if (detailRes.data.successed && detailRes.data.data && detailRes.data.data.length) {
            detailRes.data.data.forEach(item => {
                item.img2 = CDN_BASE_URL + '/' + item.img2;
                item.img3 = CDN_BASE_URL + '/' + item.img3;
                item.imgSrc = CDN_BASE_URL + '/' + item.imgSrc;
            });
            return detailRes;
        } else {
            wx.showToast({
                title: '发生错误',
                icon: 'none'
            })
        }

    }

    /**
     * 获取我已解锁的二级建筑
     * @param {any} uid 用户id
     * @returns {any}
     */
    async getMyBuild(uid) {
        let myBuild = await this.request({
            url: URL.MY_UNLOCK_BUILD,
            data: {
                uid
            }
        });

        if (myBuild.data.successed) {
            myBuild.data.data.forEach(item => {
                item.img = CDN_BASE_URL + '/' + item.img;
                return item;
            });
            return myBuild.data;
        } else {
            wx.showToast({
                title: '发生错误,请稍后再试',
                icon: 'none',
            });
        }
    }

    /**
     * 解锁二级建筑
     * @param {any} uid 用户id
     * @param {any} build_id    建筑id
     * @returns {any}
     */
    async unlock(uid, build_id) {
        let unlockRes = await this.request({
            url: URL.UNLOCK_BUILD,
            method: "POST",
            data: {
                uid,
                build_id
            }
        })
        return unlockRes.data;
    }

    /**
     * 获取赛季获奖的信息
     * @returns {any}
     */
    async getAwardInfo() {
        let AwardInfo = await this.request({
            url: URL.ACTIVITY_PRICE
        });
        return AwardInfo.data;
    }

    /**
     * 获取向阳闯关进度
     * @param {any} uid 用户id
     * @returns {any}
     */
    getTreeStatus(uid) {
        return this.request({
            url: URL.TREE_STATUS,
            data: {
                uid
            }
        })
    }

    /**
     * 播种
     * @param {any} uid 用户id
     * @returns {any}
     */
    putSeed(uid) {
        return this.request({
            url: URL.PUT_SEED,
            method: 'POST',
            data: {
                uid
            }
        });
    }

}


export default CommonModel;