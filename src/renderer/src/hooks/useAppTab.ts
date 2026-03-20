import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { AppTab, setActiveTab } from '../store/slices/tabSlice'

export function useAppTab() {
  const activeTab = useSelector((state: RootState) => state.tab.activeTab)
  const dispatch = useDispatch()
  const setTab = (tab: AppTab) => dispatch(setActiveTab(tab))
  return { activeTab, setTab }
}
