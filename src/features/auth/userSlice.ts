import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../interfaces/user.interface";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    //MIGHT BE ERROR HERE(ERR)
    setUser: (state, { payload }) => {
      if (payload) {
        state.user = payload;
      }
      // return state.user
    },
  },
});

export const { setUser } = user.actions;
export default user.reducer;
