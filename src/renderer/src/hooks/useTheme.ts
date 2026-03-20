import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { setTheme as setThemeAction, type Theme } from '../store/slices/themeSlice'

export function useTheme() {
  const theme = useSelector((s: RootState) => s.theme.theme)
  const dispatch = useDispatch<AppDispatch>()
  return {
    theme,
    setTheme: (t: Theme) => dispatch(setThemeAction(t))
  }
}
