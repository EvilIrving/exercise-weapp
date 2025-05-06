import { create } from "zustand";
import Storage from "../utils/storage";

/**
 * 创建持久化 store
 * @param {string} name - store 名称，用作存储键名
 * @param {Function} setup - store 设置函数
 * @param {Object} options - 配置选项
 * @param {boolean} options.loadOnInit - 是否在初始化时加载缓存数据
 * @returns {Function} - 返回 zustand store hook
 */
const createPersistStore = (name, setup, options = { loadOnInit: true }) => {
  // 创建基础 store
  const useStore = create((set, get) => {
    // 持久化状态到缓存
    const persist = async () => {
      const state = get();
      // 存储前排除方法和私有字段
      const persistData = Object.entries(state)
        .filter(
          ([key, value]) => typeof value !== "function" && !key.startsWith("_")
        )
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      await Storage.set(name, persistData);
    };

    // 从缓存恢复状态
    const hydrate = async () => {
      const data = await Storage.get(name);
      if (data) {
        set(data);
        return true;
      }
      return false;
    };

    // 清除缓存
    const clearPersist = async () => {
      await Storage.remove(name);
    };

    return {
      // 添加持久化方法
      _persist: persist,
      _hydrate: hydrate,
      _clearPersist: clearPersist,

      // 加载用户设置的 store 初始状态和方法
      ...setup(
        // 增强 set 方法，自动持久化
        (...args) => {
          set(...args);
          persist();
        },
        get
      ),
    };
  });

  // 在组件外初始化加载
  if (options.loadOnInit) {
    // 在小程序环境中确保 API 可用
    if (typeof Taro !== "undefined") {
      setTimeout(async () => {
        const store = useStore.getState();
        await store._hydrate();
      }, 0);
    }
  }

  return useStore;
};

export default createPersistStore;
