import {
  setStorageSync,
  getStorageSync,
  removeStorageSync,
} from "@tarojs/taro";

const StorageSceneKey = {
  RECORDS: "storage-records",
};
function getItem(key) {
  const value = getStorageSync(key);
  return value ? JSON.parse(value) ?? null : null;
}
function setItem(key, value) {
  setStorageSync(key, JSON.stringify(value));
}
function removeItem(key) {
  removeStorageSync(key);
}
export { getItem, setItem, removeItem, StorageSceneKey };

/** @description 用来给 zustand 持久化存储的方法 */
export const zustandStorage = {
  getItem: (key) => {
    const value = getStorageSync(key);
    return value ?? null;
  },
  setItem: (key, value) => {
    setStorageSync(key, value);
  },
  removeItem: (key) => {
    removeStorageSync(key);
  },
};
