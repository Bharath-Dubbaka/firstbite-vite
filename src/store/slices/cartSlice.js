import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   items: [], // each item = {id, name, price, qty, image}
   totalAmount: 0,
   totalQuantity: 0,
};

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addItem: (state, action) => {
         const item = action.payload;
         const existingItem = state.items.find((i) => i._id === item._id);

         if (existingItem) {
            existingItem.qty += 1;
         } else {
            state.items.push({ ...item, qty: 1 });
         }

         state.totalQuantity += 1;
         state.totalAmount += item.price;
      },

      removeItem: (state, action) => {
         const id = action.payload;
         const existingItem = state.items.find((i) => i._id === id);

         if (existingItem) {
            state.totalQuantity -= existingItem.qty;
            state.totalAmount -= existingItem.price * existingItem.qty;
            state.items = state.items.filter((i) => i._id !== id);
         }
      },

      increaseQty: (state, action) => {
         const id = action.payload;
         const existingItem = state.items.find((i) => i._id === id);

         if (existingItem) {
            existingItem.qty += 1;
            state.totalQuantity += 1;
            state.totalAmount += existingItem.price;
         }
      },

      decreaseQty: (state, action) => {
         const id = action.payload;
         const existingItem = state.items.find((i) => i._id === id);

         if (existingItem && existingItem.qty > 1) {
            existingItem.qty -= 1;
            state.totalQuantity -= 1;
            state.totalAmount -= existingItem.price;
         }
      },

      clearCart: (state) => {
         state.items = [];
         state.totalAmount = 0;
         state.totalQuantity = 0;
      },
   },
});

export const { addItem, removeItem, increaseQty, decreaseQty, clearCart } =
   cartSlice.actions;
export default cartSlice.reducer;
