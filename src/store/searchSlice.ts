import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Station {
  code: string;
  name: string;
}

export interface SearchState {
  from: Station | null;
  to: Station | null;
  date: string;
}

const initialState: SearchState = {
  from: null,
  to: null,
  date: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchData: (state, action: PayloadAction<{ from: Station | null; to: Station | null; date: string }>) => {
      state.from = action.payload.from;
      state.to = action.payload.to;
      state.date = action.payload.date;
    },
  },
});

export const { setSearchData } = searchSlice.actions;

export default searchSlice.reducer;
