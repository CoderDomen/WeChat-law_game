import UserModel from '../model/userModel';

/**
 * 检查护盾
 * @returns {any}
 */
function Shield() {
    let shield = UserModel.getCacheUser('shield');
    return shield;
}


export {
    Shield
};