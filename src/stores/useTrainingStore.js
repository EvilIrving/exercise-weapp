import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import createSelectors from "./libs/selector";

const initialState = {
  isTraining: false,
};

const store = create()(
  immer((set, _get) => ({
    isTraining: initialState.isTraining,
    setIsTraining: (isTraining) => set({ isTraining }),
  }))
);

export const useTrainingStore = createSelectors(store);
export function useTrainingReset() {
  store.setState(initialState);
}
