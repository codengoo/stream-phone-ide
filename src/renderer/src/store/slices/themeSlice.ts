import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'system' | 'dark' | 'light'

export interface AppThemeState {
  theme: Theme
}

const saved = localStorage.getItem('theme') as Theme | null

const initialState: AppThemeState = {
  theme: saved ?? 'system'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    }
  }
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
