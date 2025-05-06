import createPersistStore from "./createPersistStore";

/**
 * 训练记录 Store
 */
const useRecordsStore = createPersistStore("trainingRecords", (set, get) => ({
  // 所有训练记录
  records: [],

  // 个人最佳记录
  personalBests: {},

  /**
   * 添加训练记录
   * @param {Object} record - 训练记录
   */
  addRecord: (record) => {
    set((state) => {
      const newRecords = [record, ...state.records];
      // 更新个人最佳记录
      const updatedBests = { ...state.personalBests };

      // 遍历训练中的每个运动项目
      record.exercises.forEach((exercise) => {
        // 找出每个运动的最佳组
        exercise.sets.forEach((setData) => {
          const exerciseKey = exercise.name;
          const currentBest = updatedBests[exerciseKey];

          // 根据重量和次数计算总重量
          const totalWeight = setData.weight * setData.reps;

          // 如果没有记录或当前组超过最佳记录
          if (!currentBest || totalWeight > currentBest.totalWeight) {
            updatedBests[exerciseKey] = {
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              weight: setData.weight,
              reps: setData.reps,
              totalWeight: totalWeight,
              date: record.endTime,
              trainingId: record.id,
            };
          }
        });
      });

      return {
        records: newRecords,
        personalBests: updatedBests,
      };
    });
  },

  /**
   * 获取指定训练记录
   * @param {string} recordId - 记录 ID
   * @returns {Object|null} - 训练记录或 null
   */
  getRecord: (recordId) => {
    const state = get();
    return state.records.find((record) => record.id === recordId) || null;
  },

  /**
   * 删除训练记录
   * @param {string} recordId - 记录 ID
   */
  deleteRecord: (recordId) => {
    set((state) => {
      const newRecords = state.records.filter(
        (record) => record.id !== recordId
      );

      // 重新计算个人最佳记录（当删除的记录可能包含最佳记录时）
      const updatedBests = {};

      newRecords.forEach((record) => {
        record.exercises.forEach((exercise) => {
          exercise.sets.forEach((setData) => {
            const exerciseKey = exercise.name;
            const currentBest = updatedBests[exerciseKey];
            const totalWeight = setData.weight * setData.reps;

            if (!currentBest || totalWeight > currentBest.totalWeight) {
              updatedBests[exerciseKey] = {
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                weight: setData.weight,
                reps: setData.reps,
                totalWeight: totalWeight,
                date: record.endTime,
                trainingId: record.id,
              };
            }
          });
        });
      });

      return {
        records: newRecords,
        personalBests: updatedBests,
      };
    });
  },

  /**
   * 获取指定运动的历史记录
   * @param {string} exerciseName - 运动名称
   * @returns {Array} - 运动历史记录
   */
  getExerciseHistory: (exerciseName) => {
    const state = get();
    const history = [];

    state.records.forEach((record) => {
      record.exercises.forEach((exercise) => {
        if (exercise.name === exerciseName) {
          history.push({
            trainingId: record.id,
            trainingDate: record.startTime,
            sets: exercise.sets,
            totalVolume: exercise.sets.reduce(
              (total, set) => total + set.weight * set.reps,
              0
            ),
          });
        }
      });
    });

    return history.sort(
      (a, b) => new Date(b.trainingDate) - new Date(a.trainingDate)
    );
  },

  /**
   * 清除所有记录
   */
  clearRecords: () => {
    set({
      records: [],
      personalBests: {},
    });
  },
}));

export default useRecordsStore;
