import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TrainInfo } from '../components/TrainCard';

export interface Station {
  code: string;
  name: string;
}

export interface SmartRouteResult {
  id: number;
  junction: { name: string; code: string };
  waitTime: string;
  leg1: TrainInfo;
  leg2: TrainInfo;
  leg1DepartureDate?: string;
  leg1ArrivalDate?: string;
  leg2DepartureDate?: string;
  leg2ArrivalDate?: string;
}

export interface SearchState {
  from: Station | null;
  to: Station | null;
  date: string;
  directTrainsCache: Record<string, TrainInfo[]>;
  smartRoutesCache: Record<string, SmartRouteResult[]>;
}

const initialState: SearchState = {
  from: null,
  to: null,
  date: '',
  directTrainsCache: {},
  smartRoutesCache: {},
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
    setCachedDirectTrains: (state, action: PayloadAction<{ key: string; trains: TrainInfo[] }>) => {
      state.directTrainsCache[action.payload.key] = action.payload.trains;
    },
    setCachedSmartRoutes: (state, action: PayloadAction<{ key: string; routes: SmartRouteResult[] }>) => {
      state.smartRoutesCache[action.payload.key] = action.payload.routes;
    },
    clearCache: (state) => {
      state.directTrainsCache = {};
      state.smartRoutesCache = {};
    },
  },
});

export const { setSearchData, setCachedDirectTrains, setCachedSmartRoutes, clearCache } = searchSlice.actions;

export default searchSlice.reducer;
