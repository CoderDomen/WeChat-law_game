import { transformAnswer } from '../../../utils/util';
import { GAME_MODE, IDENTIFY } from '../../../config/config';
// 初始化score成绩对象
export const initScore = JSON.stringify({
	my: {
		result: 0,
		time: 0,
	},
	enemy: {
		result: 0,
		time: 0,
	},
});
export default {
	// win、fail组件返回功能
	handleBack() {
		wx.navigateBack({
			delta: 2,
		});
	},

	// 分享
	handleShare() {
		this.setData({
			share: true,
		});
	},

	// 导航栏组件返回事件
	handleNavBack() {
		// 清除轮训计时器
		if (this.data.type === GAME_MODE.FRIEND) {
			this._stopTrain();
		}
		this.setData({
			close: true,
		});
	},

	// 比较分数
	_canIwin(useBool, res) {
		if (!res && !(useBool instanceof Boolean)) {
			res = useBool;
			useBool = false;
		}
		if (useBool) {
			var [win, fail] = [true, false];
		} else {
			var [win, fail] = ['win', 'fail'];
		}
		if (this._isExit) {
			// 对方提前退出了
			return win;
		}

		let result = null;
		if (res) {
			// 判断身份
			if (this.data.ID_status === IDENTIFY.FRIEND) {
				// 使用user2
				result = res.user2win ? win : fail;
			} else if (this.data.ID_status === IDENTIFY.SELF) {
				// 使用user1
				result = res.user1win ? win : fail;
			}
			return result;
		} else {
			// 需要和对手分数, 对手用时判断
			let { time: myTime, result: myResult } = this.data.score.my;
			let { time: enemyTime, result: enemyResult } = this.data.score.enemy;
			if (myResult === enemyResult && myTime === enemyTime) {
				myResult = myResult + 10;
			}

			// 判断最后分数是否相等
			if (myResult === enemyResult) {
				if (myTime > enemyTime) {
					return fail;
				} else {
					return win;
				}
			} else if (myResult > enemyResult) {
				return win;
			} else if (myResult < enemyResult) {
				return fail;
			}
		}
	},
	// 判断是否已经到达最后一题
	_isEnd() {
		return this.data.currQuIndex + 1 >= this.data.questions.length;
	},
	// 更新分数和时间
	_updateScore() {
		this.setData({
			score: this.data.score,
		});
	},
	// 显示提示
	_showTips(title) {
		wx.showToast({
			title,
			icon: 'none',
		});
	},

	// 匹配游戏模式
	_matchGameMode(type) {
		switch (type) {
			case GAME_MODE.RANDOM:
				this._randomGame();
				break;
			case GAME_MODE.FRIEND:
				this._friendGame();
				break;
			default:
				break;
		}
	},
	_showLoading(title = '加载中') {
		wx.showLoading({
			title,
		});
	},
	_hideLoading() {
		wx.hideLoading();
	},
	// 调整题目数据结构
	_formatQue(ques) {
		return ques.map(item => {
			item.ans = transformAnswer(item.ans);
			return item;
		});
	},
};
