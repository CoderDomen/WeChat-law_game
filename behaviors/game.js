// 四种闯关模式公用的Behavior

const gameMode = Behavior({
	methods: {
		// 获取用户id
		_getUid() {
			return wx.getStorageSync('uid');
		},
	},
});

export default gameMode;
