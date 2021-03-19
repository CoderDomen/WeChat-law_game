class SunnyAnimate {
	// 指针
	self = null;
	constructor(pointer) {
		this.self = pointer;
	}

	/**
	 * tips动画
	 * @param {any} activeIndex    当前激活位置
	 * @param {any} lastTop    开始位置
	 * @param {any} currTop    最后位置
	 * @param {any} fn  回调函数
	 * @returns {any}
	 */
	tipsAnimation(activeIndex, currTop, fn) {
		this.self.animate(
			`#tips${activeIndex}`,
			[
				{
					opacity: 0,
					top: '55%',
					offset: 0,
				},
				{ opacity: 1, top: currTop, offset: 1 },
			],
			300,
			fn
		);
	}

	/**
	 * 下一题按钮动画
	 * @param {any} fn 回调函数
	 * @returns {any}
	 */
	nextAnimation(fn) {
		this.self.animate(
			'#nextBtn',
			[
				{ opacity: 0, offset: 0 },
				{ opacity: 1, offset: 1 },
			],
			300,
			fn
		);
	}

	/**
	 * 下一题按钮离场动画
	 * @param {any} fn	回调函数
	 * @returns {any}
	 */
	nextLeaveAnimation(fn) {
		this.self.animate(
			'#nextBtn',
			[
				{ opacity: 1, translate3d: [0, '0%', 0], offset: 0 },
				{ opacity: 0, translate3d: [0, '100%', 0], offset: 1 },
			],
			300,
			fn
		);
	}

	/**
	 * 开场动画
	 * @param {any} fn  回调函数
	 * @returns {any}
	 */
	openAnimation(fn) {
		this.self.animate(
			'#pannel',
			[
				{ opacity: 0, translate3d: ['110%', 0, 0], offset: 0 },
				{ opacity: 1, translate3d: ['0%', 0, 0], offset: 1 },
			],
			300,
			fn
		);
	}

	/**
	 * 离场动画
	 * @param {any} fn
	 * @returns {any}
	 */
	leaveAnimation(fn) {
		this.self.animate(
			'#pannel',
			[
				{ opacity: 1, translate3d: ['0', 0, 0], offset: 0 },
				{ opacity: 0, translate3d: ['-110%', 0, 0], offset: 1 },
			],
			300,
			fn
		);
	}
}

class SunnyTree {
	self = null;
	constructor(self) {
		this.self = self;
	}
	// 淡进
	fadeIn(id, fn) {
		console.log('fadeIn');
		this.self.animate(
			id,
			[
				{ opacity: 0, offset: 0 },
				{ opacity: 1, offset: 1 },
			],
			300,
			fn
		);
	}

	// 淡出
	fadeOut(id, fn) {
		this.self.animate(
			id,
			[
				{ opacity: 1, offset: 0 },
				{ opacity: 0, offset: 1 },
			],
			300,
			fn
		);
	}
}

export {SunnyTree};

export default SunnyAnimate;
