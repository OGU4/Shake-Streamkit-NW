import { useSelector, useStore } from 'react-redux'

import type { AppStore, RootState } from './store'

// Use throughout your app instead of plain `useSelector` and `useStore`
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
