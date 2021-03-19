// 统一设置顶部高度的Behavior

import { getBarHeight } from '../utils/util';
const navBev = Behavior({
	data: {
		offsetTop: getBarHeight(),
	},
});

export default navBev;