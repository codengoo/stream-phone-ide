import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type AppTab = 'devices' | 'info'

export interface AppTabState {
  activeTab: AppTab
}

const initialState: AppTabState = {
  activeTab: 'devices',
}

const tabSlice = createSlice({
  name: 'app-tab',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<AppTab>) {
      state.activeTab = action.payload
    },
  },
})

export const { setActiveTab } = tabSlice.actions
export default tabSlice.reducer
