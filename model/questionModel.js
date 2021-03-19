import Http from '../api/http';
import URL from '../api/url';
import { HARD, CAT } from '../config/config';

class QuestionModel extends Http {
	/**
	 * 获取问题数据
	 * @param {any} uid 用户id
	 * @param {any} cat_id  分类id
	 * @param {any} hard    难度
	 * @returns {any}
	 */
	async get(uid, cat_id, hard = 0) {
		// hard = HARD.L3;
		// if(cat_id === CAT.SUN || cat_id === CAT.HAPPINESS) {
		// 	cat_id = CAT.ARROW;
		// }
		let result = await this.request({
			url: URL.QUESTION.GET,
			method: 'GET',
			data: { uid, cat_id, hard },
		});
		if (result.data.data && result.data.data.length) {
			result.data.data.forEach(da => {
				da.ans = da.ans.trim();
			});
		}
		return result.data;
	}
}

export default QuestionModel;
