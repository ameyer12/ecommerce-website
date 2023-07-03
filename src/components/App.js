import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home, Login, Register, Navbar } from '../components';
import './app.css';

function App() {
  const [token, setToken] = useState(window.localStorage.getItem('token'));

  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={ <Home /> }></Route>
        <Route path='/login' element={ <Login navigate={navigate} setToken={setToken} /> }></Route>
        <Route path='/register' element={ <Register navigate={navigate} setToken={setToken} /> }></Route>
      </Routes>
    </div>
  );
}

export default App;
