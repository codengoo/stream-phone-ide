import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CaptureType } from '@services/api'

export interface CaptureSettingState {
  captureType: CaptureType
}

const initialState: CaptureSettingState = {
  captureType: (localStorage.getItem('capture-type') as CaptureType) || 'minicap'
}

const slice = createSlice({
  name: 'captureSetting',
  initialState,
  reducers: {
    setCaptureType(state, action: PayloadAction<CaptureType>) {
      state.captureType = action.payload
      localStorage.setItem('capture-type', action.payload)
    }
  }
})

export const { setCaptureType } = slice.actions
export default slice.reducer
