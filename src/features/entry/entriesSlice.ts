import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Entry } from "../../interfaces/entry.interface";

const entries = createSlice({
  name: "entries",
  initialState: [] as Entry[],
  reducers: {
    setEntries: (state, { payload }: PayloadAction<Entry[] | null>) => {
      if (payload !== null) state = payload;
      else state = [];
    },
    updateEntry: (state, { payload }: PayloadAction<Entry>) => {
      const entryToUpdate = state.findIndex((entry) => entry.id === payload.id);
      if (entryToUpdate !== -1) state.splice(entryToUpdate, 1, payload);
    },
  },
});

export const { setEntries, updateEntry } = entries.actions;
export default entries.reducer;
