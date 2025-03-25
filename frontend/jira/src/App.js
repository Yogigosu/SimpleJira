import './App.css';
import EntityManager from './EntityManager';

function App() {
  return (
    <div className="App">
      <EntityManager entityType="users" />
      <EntityManager entityType="tasks" />
    </div>
  );
}

export default App;
