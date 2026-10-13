import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import signupReducer from './slices/signupSlice'
import statisticsReducer from './slices/statisticsSlice'
import ticketsReducer from './slices/ticketsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  signup: signupReducer,
  statistics: statisticsReducer,
  tickets: ticketsReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
