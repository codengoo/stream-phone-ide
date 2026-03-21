import type { RootState } from '@store/index'
import { setServerConfig, setServerPass, setServerSource } from '@store/slices/serverSettingSlice'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function useServerSetting() {
  const state = useSelector((s: RootState) => s.serverSetting)
  const dispatch = useDispatch()

  return {
    state,
    setServerConfig: useCallback((host: string, port: string) => dispatch(setServerConfig({ host, port })), [dispatch]),
    setServerPass: useCallback((p: string) => dispatch(setServerPass(p)), [dispatch]),
    setServerSource: useCallback((s: any) => dispatch(setServerSource(s)), [dispatch])
  }
}
