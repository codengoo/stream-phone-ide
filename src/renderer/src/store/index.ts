import { configureStore } from '@reduxjs/toolkit'
import captureSettingReducer from './slices/captureSettingSlice'
import displaySettingReducer from './slices/displaySettingSlice'
import serverSettingReducer from './slices/serverSettingSlice'
import tabReducer from './slices/tabSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    tab: tabReducer,
    captureSetting: captureSettingReducer,
    serverSetting: serverSettingReducer,
    displaySetting: displaySettingReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
