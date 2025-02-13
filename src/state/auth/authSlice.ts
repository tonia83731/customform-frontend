/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userInfo: {
    name: string;
    email: string;
  };
  isAuth: boolean;
}

const initialState: AuthState = {
  userInfo: {
    name: "",
    email: "",
  },
  isAuth: false,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addUserInfo: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
      }>
    ) => {
      state.userInfo = action.payload;
    },
  },
});

export const { addUserInfo } = dataSlice.actions;

export default dataSlice.reducer;
