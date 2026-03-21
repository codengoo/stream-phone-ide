import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DisplaySettingState {
  cardSize: number
}

const defaultCard = 160

const initialState: DisplaySettingState = {
  cardSize: Number(localStorage.getItem('card-size')) || defaultCard
}

const slice = createSlice({
  name: 'displaySetting',
  initialState,
  reducers: {
    setCardSize(state, action: PayloadAction<number>) {
      state.cardSize = action.payload
      localStorage.setItem('card-size', String(action.payload))
    }
  }
})

export const { setCardSize } = slice.actions
export default slice.reducer
