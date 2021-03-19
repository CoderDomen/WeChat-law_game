
/* 
    单独实例化该类毫无意义，纯粹为了好维护
*/

class FolkAnimate {
	constructor(self) {
        this.self = self;
    }

	/**
	 * 开场动画
	 * @returns {any}
	 */
	_firstAnimation() {
		this.self.animate(
			'#title',
			[
				{ opacity: 0, translate3d: [0, '-100%', 0], offset: 0 },
				{ opacity: 1, translate3d: [0, '0%', 0], offset: 1 },
			],
			500
		);
		this.self.animate(
			'#subject',
			[
				{ opacity: 0, translate3d: [0, '100%', 0], offset: 0 },
				{ opacity: 1, translate3d: [0, '0%', 0], offset: 1 },
			],
			500,
			() => {
				this.self._unlock();
			}
		);
	}

	/**
	 * 下一题动画
	 * @returns {any}
	 */
	_nextAnimation(fn) {
		this.self.animate(
			'#title',
			[
				{ opacity: 1, scale: [1], offset: 0 },
				{ opacity: 0, scale: [0], offset: 1 },
			],
			300,
			() => {
				this.self.animate(
					'#subject',
					[
						{ opacity: 1, translate3d: ['0%', 0, 0], offset: 0 },
						{ opacity: 0, translate3d: ['-100%', 0, 0], offset: 1 },
					],
					300,
					() => {
						this.self.clearAnimation('#title');

						// 绑定参数重置
						this.self._reback();
						// 格式化问题
						this.self._formatQuestion();

						this.self.animate(
							'#title',
							[
								{ opacity: 0, translate3d: [0, '-100%', 0], offset: 0 },
								{ opacity: 1, translate3d: [0, '0%', 0], offset: 1 },
							],
							300
						);
						this.self.animate(
							'#subject',
							[
								{ opacity: 0, translate3d: ['100%', 0, 0], offset: 0 },
								{ opacity: 1, translate3d: ['1', 0, 0], offset: 1 },
							],
							300,
							() => {
								this.self._unlock();
								fn && fn();
							}
						);
					}
				);
			}
		);
	}
}

export default FolkAnimate;
