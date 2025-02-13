import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormResponseType } from "../../type/module";

interface MainState {
  formLists: FormResponseType[];
}

const initialState: MainState = {
  formLists: [],
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    initializedFormLists: (state, action) => {
      state.formLists = action.payload;
    },
    addForm: (state, action: PayloadAction<FormResponseType>) => {
      state.formLists.push(action.payload);
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.formLists = state.formLists.filter(
        (form) => form._id !== action.payload
      );
    },
  },
});

export const { initializedFormLists, addForm, deleteForm } = mainSlice.actions;

export default mainSlice.reducer;
