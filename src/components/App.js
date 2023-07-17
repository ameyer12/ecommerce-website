import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home, Login, Register, Navbar, Shop, Admin, AddProduct, DeleteProduct, DeleteUser, EditProduct, Cart } from '../components';
import './app.css';

function App() {
  const [token, setToken] = useState(window.localStorage.getItem('token'));

  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={ <Home navigate={navigate}/> }></Route>
        <Route path='/login' element={ <Login navigate={navigate} setToken={setToken} /> }></Route>
        <Route path='/register' element={ <Register navigate={navigate} setToken={setToken} /> }></Route>
        <Route path='/products' element={ <Shop navigate={navigate} /> }></Route>
        <Route path='/admin' element={ <Admin navigate={navigate} /> }></Route>
        <Route path='/addproduct' element={ <AddProduct navigate={navigate} /> }></Route>
        <Route path='/deleteproduct' element={ <DeleteProduct navigate={navigate} /> }></Route>
        <Route path='/deleteuser' element={ <DeleteUser navigate={navigate} /> }></Route>
        <Route path='/editproduct' element={ <EditProduct navigate={navigate} /> }></Route>
        <Route path='/cart' element={ <Cart navigate={navigate} /> }></Route>
      </Routes>
    </div>
  );
}

export default App;
