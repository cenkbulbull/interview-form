import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import formsReducer from "./formsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    forms: formsReducer,
  },
});

export default store;
