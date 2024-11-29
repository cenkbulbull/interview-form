import { createSlice } from "@reduxjs/toolkit";

// initialState: Redux store'daki başlangıç durumu
const initialState = {
  token: null,
  isLoggedIn: false,
};

// Slice oluşturuyoruz
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload; // Token'ı state'e kaydediyoruz
      state.isLoggedIn = action.payload !== null; // Token varsa giriş yapmış kabul ediyoruz
    },
    logout: (state) => {
      state.token = null; // Token'ı sıfırlıyoruz
      state.isLoggedIn = false; // Giriş yapmamış kabul ediyoruz
    },
  },
});

// Reducer fonksiyonlarını export ediyoruz
export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
