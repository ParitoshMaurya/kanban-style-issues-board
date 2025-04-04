import { Provider } from 'react-redux';
import { store } from './store/store';
import { TodoBoard } from './components/TodoBoard';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto py-4 px-4">
            <h1 className="text-2xl font-bold text-gray-800">Trello-style Todo Board</h1>
          </div>
        </header>
        <main className="container mx-auto py-6 px-4">
          <TodoBoard />
        </main>
      </div>
    </Provider>
  );
}

export default App;