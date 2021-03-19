import ImgBev from '../../behaviors/imgBev';

const statusMap = new Map();
statusMap.set('narrow', 1);
statusMap.set('folk', 2);
statusMap.set('sunny', 3);
statusMap.set('happy', 4);
statusMap.set('price', 5);

Component({
  behaviors: [ImgBev],
  properties: {
	tops: Array
  },
	
  observers: {
	tops(val) {
		if(val && val.length) {
			val.forEach(v => {
				this.data[v.name].top = v.top;
				this.setData({
					[v.name]: this.data[v.name]
				});
			});
		}
	}
  },
	
  data: {
	// 下一步按钮图片
	next: '/assets/images/guide/next.png',
	// 我知道了
	Iknow: '/assets/images/guide/know.png',
	// 手指
	finger: '/assets/images/guide/finger.png',
	// 翻转手指
	finger_reve: '/assets/images/guide/finger_reve.png',
	// 弓箭传说icon和文案
	narrow: {
		icon: '/assets/images/guide/narrow.png',
		text: '/assets/images/guide/narrow_text.png',
		top: null
	},
	// 民间传说icon和文案
	folk: {
		icon: '/assets/images/guide/folk.png',
		text: '/assets/images/guide/folk_text.png',
		top: null
	},
	// 七彩人生icon和文案
	life: {
		icon: '/assets/images/guide/life.png',
		text: '/assets/images/guide/life_text.png',
		top: null
	},
	// 向阳而生icon和文案
	sunny: {
		icon: '/assets/images/guide/sunny.png',
		text: '/assets/images/guide/sunny_text.png',
		top: null
	},
	// 幸福社区icon和文案
	happy: {
		icon: '/assets/images/guide/happy.png',
		text: '/assets/images/guide/happy_text.png',
		top: null
	},
	// 幸福社区icon和文案
	price: {
		icon: '/assets/images/guide/price.png',
		text: '/assets/images/guide/price_text.png',
		top: null
	},
	// 当前状态
	status: statusMap.get('narrow'),
  },
  methods: {
	handleNext() {
		if(this.data.status === statusMap.get('price')) {
			this.triggerEvent('end');
			return;
		}
		this.setData({
			status: this.data.status + 1
		});
	}
  }
})
