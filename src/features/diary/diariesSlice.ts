import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Diary } from "../../interfaces/diary.interface";

const diaries = createSlice({
  name: "diaries",
  initialState: [] as Diary[],
  reducers: {
    addDiary: (state, { payload }: PayloadAction<Diary[]>) => {
      const diariesToSave = payload.filter((diary) => {
        return state.findIndex((item) => item.id === diary.id) === -1;
      });
      state.push(...diariesToSave);
    },
    updateDiary: (state, { payload }: PayloadAction<Diary>) => {
      const diaryToUpdate = state.findIndex((item) => item.id === payload.id);
      if (diaryToUpdate !== -1) state.splice(diaryToUpdate, 1, payload);
    },
  },
});

export const { addDiary, updateDiary } = diaries.actions;
export default diaries.reducer;
