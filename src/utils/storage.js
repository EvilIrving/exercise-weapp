import Taro from "@tarojs/taro";

/**
 * 封装 Taro Storage 相关方法
 */
export const Storage = {
  /**
   * 设置存储数据
   * @param {string} key - 存储键名
   * @param {any} data - 存储数据
   * @returns {Promise<void>}
   */
  set: (key, data) => {
    return Taro.setStorage({
      key,
      data: JSON.stringify(data),
    });
  },

  /**
   * 获取存储数据
   * @param {string} key - 存储键名
   * @returns {Promise<any>} - 返回存储数据
   */
  get: async (key) => {
    try {
      const { data } = await Taro.getStorage({ key });
      return JSON.parse(data);
    } catch (error) {
      // 当数据不存在时返回 null
      return null;
    }
  },

  /**
   * 移除存储数据
   * @param {string} key - 存储键名
   * @returns {Promise<void>}
   */
  remove: (key) => {
    return Taro.removeStorage({ key });
  },

  /**
   * 清除所有存储数据
   * @returns {Promise<void>}
   */
  clear: () => {
    return Taro.clearStorage();
  },

  /**
   * 获取当前存储信息
   * @returns {Promise<Taro.getStorageInfoSuccessCallbackResult>}
   */
  getInfo: () => {
    return Taro.getStorageInfo();
  },
};

export default Storage;
