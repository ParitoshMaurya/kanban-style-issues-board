import { combineReducers } from 'redux';
import { counterReducer } from './counterReducer';

export const rootReducer = combineReducers({
  counter: counterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;