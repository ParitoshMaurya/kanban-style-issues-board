// Action Types
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const INCREMENT_BY_AMOUNT = 'INCREMENT_BY_AMOUNT';

// Action Interfaces
interface IncrementAction {
  type: typeof INCREMENT;
}

interface DecrementAction {
  type: typeof DECREMENT;
}

interface IncrementByAmountAction {
  type: typeof INCREMENT_BY_AMOUNT;
  payload: number;
}

// Action Creators
export const increment = (): IncrementAction => ({
  type: INCREMENT,
});

export const decrement = (): DecrementAction => ({
  type: DECREMENT,
});

export const incrementByAmount = (amount: number): IncrementByAmountAction => ({
  type: INCREMENT_BY_AMOUNT,
  payload: amount,
});

export type CounterActionTypes = IncrementAction | DecrementAction | IncrementByAmountAction;