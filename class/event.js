// 观察者模式 --> 自定义事件, 单例模式

class MEvent {
    constructor() {
        this.channel = {}
    }
    on(type, fn) {
        if(this.channel[type]) {
            this.channel[type].push(fn);
        } else {
            this.channel[type] = [fn];
        }
    }
    emit(type) {
        let fnList = this.channel[type];
        fnList.forEach(fn => {
            fn();
        })
    }
}

let ev = new MEvent();

export default ev;