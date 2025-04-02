import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { increment, decrement, incrementByAmount } from '../store/actions/counterActions';
import { Plus, Minus } from 'lucide-react';

export const Counter = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Counter: {count}</h2>
      <div className="flex gap-4">
        <button
          onClick={() => dispatch(decrement())}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          aria-label="Decrement"
        >
          <Minus size={16} />
          Decrease
        </button>
        <button
          onClick={() => dispatch(increment())}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          aria-label="Increment"
        >
          <Plus size={16} />
          Increase
        </button>
      </div>
      <button
        onClick={() => dispatch(incrementByAmount(5))}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add 5
      </button>
    </div>
  );
};