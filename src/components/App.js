import { Route, Routes } from 'react-router';
import { Home } from '.'
import './app.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <Home /> }></Route>
      </Routes>
    </div>
  );
}

export default App;
