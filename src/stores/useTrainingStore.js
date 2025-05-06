import createPersistStore from "./createPersistStore";

// 训练数据的初始状态
const initialState = {
  // 当前训练信息
  currentTraining: {
    id: null,
    name: "",
    startTime: null,
    endTime: null,
    exercises: [], // 包含的运动项目
    isInProgress: false,
  },

  // 训练设置
  settings: {
    restTime: 60, // 休息时间（秒）
    units: "kg", // 单位，kg 或 lbs
    theme: "light", // 主题
  },
};

/**
 * 训练数据 Store
 */
const useTrainingStore = createPersistStore("training", (set, get) => ({
  ...initialState,

  /**
   * 开始新的训练
   * @param {string} name - 训练名称
   */
  startTraining: (name) =>
    set((state) => ({
      currentTraining: {
        ...state.currentTraining,
        id: Date.now().toString(),
        name: name || `训练 ${new Date().toLocaleDateString()}`,
        startTime: new Date().toISOString(),
        endTime: null,
        exercises: [],
        isInProgress: true,
      },
    })),

  /**
   * 结束当前训练
   */
  finishTraining: () => {
    const state = get();
    // 结束训练并保存到训练记录
    if (state.currentTraining.isInProgress) {
      const finishedTraining = {
        ...state.currentTraining,
        endTime: new Date().toISOString(),
        isInProgress: false,
      };

      set({
        currentTraining: {
          ...initialState.currentTraining,
        },
      });

      // 获取训练记录 store 并添加记录
      // 这里通过 import 获取训练记录 store，避免循环依赖
      import("./useRecordsStore").then(({ default: useRecordsStore }) => {
        useRecordsStore.getState().addRecord(finishedTraining);
      });
    }
  },

  /**
   * 添加运动到当前训练
   * @param {Object} exercise - 运动项目
   */
  addExercise: (exercise) =>
    set((state) => ({
      currentTraining: {
        ...state.currentTraining,
        exercises: [
          ...state.currentTraining.exercises,
          {
            id: Date.now().toString(),
            ...exercise,
            sets: [],
          },
        ],
      },
    })),

  /**
   * 添加一组数据到指定运动
   * @param {string} exerciseId - 运动 ID
   * @param {Object} set - 组数据，包含重量、次数等
   */
  addSet: (exerciseId, setData) =>
    set((state) => {
      const updatedExercises = state.currentTraining.exercises.map(
        (exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: Date.now().toString(),
                  ...setData,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return exercise;
        }
      );

      return {
        currentTraining: {
          ...state.currentTraining,
          exercises: updatedExercises,
        },
      };
    }),

  /**
   * 删除一组数据
   * @param {string} exerciseId - 运动 ID
   * @param {string} setId - 组 ID
   */
  removeSet: (exerciseId, setId) =>
    set((state) => {
      const updatedExercises = state.currentTraining.exercises.map(
        (exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            };
          }
          return exercise;
        }
      );

      return {
        currentTraining: {
          ...state.currentTraining,
          exercises: updatedExercises,
        },
      };
    }),

  /**
   * 更新训练设置
   * @param {Object} newSettings - 新的设置
   */
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    })),

  /**
   * 取消当前训练
   */
  cancelTraining: () =>
    set({
      currentTraining: {
        ...initialState.currentTraining,
      },
    }),

  /**
   * 重置 store 到初始状态
   */
  reset: () => {
    set(initialState);
    get()._clearPersist();
  },
}));

export default useTrainingStore;
