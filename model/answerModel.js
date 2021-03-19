import Http from '../api/http';
import URL from '../api/url';

class AnswerModel extends Http {

    /**
     * 创建房间
     * @param {any} uid 用户id
     * @param {any} cat_id  关卡分类id
     * @param {any?} hard=0   难度系数
     * @returns {any}
     */
    async createRoom(uid, cat_id, hard) {
        let res = await this.request({
            url: URL.CREATE_ROOM,
            method: 'POST',
            data: {
                uid,
                cat_id,
                hard
            }
        });
        return res.data;
    }

    /**
     * 参与房间
     * @param {any} uid 用户id
     * @param {any} room_id 房间id
     * @returns {any}
     */
    async joinRoom(uid, room_id) {
        let res = await this.request({
            url: URL.JOIN_ROOM,
            method: 'POST',
            data: {
                uid,
                room_id
            }
        })
        return res.data;
    }

    /**
     *  检查房间状态
     * @param {any} uid 用户id
     * @param {any} room_id 房间id
     * @param {any} fetchData 拉取用户数据
     * @returns {any}
     */
    async checkRoomStatus(uid, room_id, fetch_user_info = false) {
        let res = await this.request({
            url: URL.CHECK_ROOM_STATUS,
            data: {
                uid,
                room_id,
                fetch_user_info
            }
        })
        return res.data;
    }

    /**
     * 答题上传答案
     * @param {any} uid 用户id
     * @param {any} room_id 房间id
     * @param {any} score   答案
     * @param {any} qaNum   题目序号
     * @param {any} isFinish=false  是否结束
     * @returns {any}
     */
    async uploadAnswer(uid, room_id, score, qaNum, isFinish = false) {
        let res = await this.request({
            url: URL.UPLOAD_SCORE,
            method: 'POST',
            data: {
                uid,
                room_id,
                score,
                qaNum,
                isFinish: isFinish
            }
        });
        if(isFinish) {
            console.log(res);
        }
        return res.data;
    }

    /**
     * 单人答题上传分数
     * @param {{uid, wronglist, rightlist, cat_id, isWin, suiji, hard?}} options
     * @returns {any}
     */
    async uploadAnswerBySingle(options) {
        const uploadRes = await this.request({
            url: URL.UPLOAD_SCORE_SINGE,
            method: 'POST',
            data: options
        });
        return uploadRes.data;
    }

}

export default AnswerModel;
