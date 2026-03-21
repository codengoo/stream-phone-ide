import type { RootState } from '@store/index'
import { setCaptureType } from '@store/slices/captureSettingSlice'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function useCaptureSetting() {
  const state = useSelector((s: RootState) => s.captureSetting)
  const dispatch = useDispatch()

  return {
    state,
    setCaptureType: useCallback((t: any) => dispatch(setCaptureType(t)), [dispatch])
  }
}
