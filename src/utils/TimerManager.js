/**
 * TimerManager 类
 * 负责管理应用中的所有计时器，确保在训练取消、结束或应用重启时能正确销毁定时器
 */
class TimerManager {
  constructor() {
    this.timers = new Map(); // 存储所有计时器的Map
  }

  /**
   * 创建一个计时器
   * @param {string} id - 计时器唯一标识
   * @param {Function} callback - 计时器回调函数
   * @param {number} interval - 计时器间隔（毫秒）
   * @returns {string} 计时器ID
   */
  createTimer(id, callback, interval) {
    // 如果已存在同ID的计时器，先清除
    this.clearTimer(id);

    // 创建新计时器
    const timerId = setInterval(callback, interval);
    this.timers.set(id, timerId);
    return id;
  }

  /**
   * 清除指定ID的计时器
   * @param {string} id - 计时器唯一标识
   */
  clearTimer(id) {
    if (this.timers.has(id)) {
      clearInterval(this.timers.get(id));
      this.timers.delete(id);
    }
  }

  /**
   * 清除所有计时器
   */
  clearAllTimers() {
    this.timers.forEach((timerId) => {
      clearInterval(timerId);
    });
    this.timers.clear();
  }

  /**
   * 获取当前活跃的计时器数量
   * @returns {number} 计时器数量
   */
  getActiveTimersCount() {
    return this.timers.size;
  }
}

// 创建单例实例
const timerManager = new TimerManager();

export default timerManager;
