class SunnyResult {
    // 浇水,施肥等等成功标题
    succ_title = null;
    // 失败标题
    fail_title = null;
    // 失败提示
    fail_tips = null;
    // 对应的按钮图片
    imgBtn = null;

    /**
     * 构造函数
     * @param {string} succ_title
     * @param {string} fail_title
     * @param {string} fail_tips
     * @param {string} imgBtn
     * @returns {any}
     */
    constructor(succ_title, fail_title, fail_tips, imgBtn) {
        this.succ_title = succ_title;
        this.fail_title = fail_title;
        this.fail_tips = fail_tips;
        this.imgBtn = imgBtn;
    }
}

export default SunnyResult;