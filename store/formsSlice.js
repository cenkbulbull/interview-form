import { createSlice } from "@reduxjs/toolkit";

// initialState: Redux store'daki başlangıç durumu
const initialState = {
  forms: [], // Initially, forms should be an empty array
};

// Slice oluşturuyoruz
const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    setForms: (state, action) => {
      state.forms = action.payload; // Formları state'e kaydediyoruz
    },
    addForm: (state, action) => {
      state.forms.push(action.payload); // Yeni formu ekliyoruz
    },
  },
});

// Reducer fonksiyonlarını export ediyoruz
export const { setForms, addForm } = formsSlice.actions;
export default formsSlice.reducer;
