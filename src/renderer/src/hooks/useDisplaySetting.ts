import type { RootState } from '@store/index'
import { setCardSize } from '@store/slices/displaySettingSlice'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function useDisplaySetting() {
  const state = useSelector((s: RootState) => s.displaySetting)
  const dispatch = useDispatch()

  return {
    state,
    setCardSize: useCallback((size: number) => dispatch(setCardSize(size)), [dispatch])
  }
}
