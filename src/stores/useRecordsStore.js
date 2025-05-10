/**
 * 训练记录 数据格式
 const record = {
  id: '123', // 记录 ID
  exerciseName: '默认名称或自定义', // 训练名称
  date: '2023-08-12', // 训练日期
  notes: '训练备注', // 训练备注
  duration: '30m', // 训练时长
  exercises: [
    {
      id: '456', // 运动 ID
      name: '深蹲', // 运动名称
      sets: [
        { weight: 12, reps: 12 }, // 重量 和 次数
        { weight: 12, reps: 5 },
        { weight: 12, reps: 5 },
        { weight: 12, reps: 5 },
      ]
    }
  ]
 }
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
import createSelectors from "./libs/selector";
import { zustandStorage, StorageSceneKey } from "./libs/storage";

/**
 * 训练记录 Store
 */

const initialState = {
  records: [],
};

const store = create(
  immer(
    persist(
      (set, _get) => ({
        records: initialState.records,
        addRecord: (record) => {
          set((state) => {
            // 确保记录符合预期格式
            const validRecord = {
              id: record.id || Date.now().toString(),
              exerciseName: record.exerciseName || "未命名训练",
              date: record.date || new Date().toISOString().split("T")[0],
              notes: record.notes || "",
              duration: record.duration || "0m",
              exercises: record.exercises || [],
            };

            return {
              records: [validRecord, ...state.records],
            };
          });
        },
        getRecord: (recordId) => {
          const state = _get();
          return state.records.find((record) => record.id === recordId) || null;
        },
        updateRecord: (record) => {},
        deleteRecord: (recordId) => {
          set((state) => ({
            records: state.records.filter((record) => record.id !== recordId),
          }));
        },
        getRecordsByDate: (dateStr) => {
          const state = _get();
          return state.records.filter((record) => record.date === dateStr);
        },
        getRecordsByMonth: (record) => {},
        clearRecords: (record) => {
          set({
            records: [],
          });
        },
      }),
      {
        name: StorageSceneKey.RECORDS,
        storage: createJSONStorage(() => zustandStorage),
      }
    )
  )
);
export const useRecordsStore = createSelectors(store);

export function useRecordsReset() {
  store.setState(initialState);
}
