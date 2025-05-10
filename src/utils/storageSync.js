import Taro from "@tarojs/taro";

/**
 * 封装 Taro Storage Sync 相关方法
 * 这些方法为同步方法，会直接返回结果而不是 Promise
 */
export const StorageSync = {
  /**
   * 同步设置存储数据
   * @param {string} key - 存储键名
   * @param {any} data - 存储数据
   * @returns {void}
   */
  set: (key, data) => {
    try {
      // 对象和数组需要先序列化
      const stringData = typeof data === "object" ? JSON.stringify(data) : data;
      Taro.setStorageSync(key, stringData);
      return true;
    } catch (error) {
      console.error("setStorageSync 失败:", error);
      return false;
    }
  },

  /**
   * 同步获取存储数据
   * @param {string} key - 存储键名
   * @param {any} defaultValue - 当数据不存在时的默认值
   * @returns {any} - 返回存储数据
   */
  get: (key, defaultValue = null) => {
    try {
      const data = Taro.getStorageSync(key);

      // 检查是否为空
      if (data === "" || data === undefined || data === null) {
        return defaultValue;
      }

      // 尝试解析 JSON 字符串
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (e) {
          // 如果解析失败，说明不是 JSON 字符串，直接返回
          return data;
        }
      }

      return data;
    } catch (error) {
      console.error("getStorageSync 失败:", error);
      return defaultValue;
    }
  },

  /**
   * 同步移除存储数据
   * @param {string} key - 存储键名
   * @returns {boolean} - 操作是否成功
   */
  remove: (key) => {
    try {
      Taro.removeStorageSync(key);
      return true;
    } catch (error) {
      console.error("removeStorageSync 失败:", error);
      return false;
    }
  },

  /**
   * 同步清除所有存储数据
   * @returns {boolean} - 操作是否成功
   */
  clear: () => {
    try {
      Taro.clearStorageSync();
      return true;
    } catch (error) {
      console.error("clearStorageSync 失败:", error);
      return false;
    }
  },

  /**
   * 同步获取当前存储信息
   * @returns {Object|null} - 存储信息或 null
   */
  getInfo: () => {
    try {
      return Taro.getStorageInfoSync();
    } catch (error) {
      console.error("getStorageInfoSync 失败:", error);
      return null;
    }
  },

  /**
   * 同步检查键是否存在
   * @param {string} key - 存储键名
   * @returns {boolean} - 键是否存在
   */
  has: (key) => {
    try {
      const res = Taro.getStorageInfoSync();
      return res.keys.includes(key);
    } catch (error) {
      console.error("检查键是否存在失败:", error);
      return false;
    }
  },

  /**
   * 同步获取所有键
   * @returns {Array<string>} - 所有存储键的数组
   */
  getAllKeys: () => {
    try {
      const res = Taro.getStorageInfoSync();
      return res.keys;
    } catch (error) {
      console.error("获取所有键失败:", error);
      return [];
    }
  },

  /**
   * 批量设置存储数据
   * @param {Object} dataMap - 键值对象
   * @returns {boolean} - 是否全部成功
   */
  batchSet: (dataMap) => {
    try {
      Object.entries(dataMap).forEach(([key, value]) => {
        const stringData =
          typeof value === "object" ? JSON.stringify(value) : value;
        Taro.setStorageSync(key, stringData);
      });
      return true;
    } catch (error) {
      console.error("批量设置失败:", error);
      return false;
    }
  },

  /**
   * 批量获取存储数据
   * @param {Array<string>} keys - 要获取的键数组
   * @returns {Object} - 键值对象
   */
  batchGet: (keys) => {
    const result = {};
    try {
      keys.forEach((key) => {
        const value = StorageSync.get(key);
        if (value !== null) {
          result[key] = value;
        }
      });
    } catch (error) {
      console.error("批量获取失败:", error);
    }
    return result;
  },

  /**
   * 安全地设置数据，防止超出存储限制
   * @param {string} key - 存储键名
   * @param {any} data - 存储数据
   * @param {boolean} overwrite - 如果空间不足是否覆盖
   * @returns {boolean} - 是否成功
   */
  safeSet: (key, data, overwrite = false) => {
    try {
      const stringData = typeof data === "object" ? JSON.stringify(data) : data;
      const dataSize = stringData.length * 2; // 估计字节大小

      // 获取存储信息
      const info = Taro.getStorageInfoSync();
      const remainingSpace = info.limitSize * 1024 - info.currentSize;

      // 检查空间是否足够
      if (dataSize > remainingSpace) {
        if (overwrite) {
          // 空间不足，尝试先删除原来的数据再存储
          StorageSync.remove(key);
          Taro.setStorageSync(key, stringData);
          return true;
        } else {
          console.warn("存储空间不足");
          return false;
        }
      }

      // 空间足够，直接存储
      Taro.setStorageSync(key, stringData);
      return true;
    } catch (error) {
      console.error("安全设置失败:", error);
      return false;
    }
  },
};

export default StorageSync;
