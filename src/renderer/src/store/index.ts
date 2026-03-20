import { configureStore } from '@reduxjs/toolkit'
import tabReducer from './slices/tabSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    tab: tabReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
