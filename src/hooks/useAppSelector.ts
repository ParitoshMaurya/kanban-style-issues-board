import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store/reducers/rootReducer';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;