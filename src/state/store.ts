import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./form/mainSlice";
import formReducer from "./form/formSlice";
import responseReducer from "./form/responseSlice";
import dataReducer from "./form/dataSlice";

export const store = configureStore({
  reducer: {
    main: mainReducer,
    form: formReducer,
    response: responseReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
