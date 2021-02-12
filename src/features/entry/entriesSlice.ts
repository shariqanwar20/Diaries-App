import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Entry } from "../../interfaces/entry.interface";

const initialState: Entry[] = [];

const entries = createSlice({
  name: "entries",
  initialState,
  reducers: {
    setEntries: (state, { payload }: PayloadAction<Entry[]>) => {
      console.log(payload);
      // const entriesToSave = payload.filter((entry) => {
      //   return state.findIndex((item) => item.id === entry.id) === -1;
      // });
      // state.push(...entriesToSave);
      state = payload;
      console.log(state);
      return state;
    },
    updateEntry: (state, { payload }: PayloadAction<Entry>) => {
      const entryToUpdate = state.findIndex((entry) => entry.id === payload.id);
      if (entryToUpdate !== -1) state.splice(entryToUpdate, 1, payload);
    },
  },
});

export const { setEntries, updateEntry } = entries.actions;
export default entries.reducer;
