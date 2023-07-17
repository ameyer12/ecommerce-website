import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './shop.css';

function Shop() {

  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(0);
  const [productId, setProductId] = useState(1);
  const [quantity, setQuantity] = useState(0); 

  const fetchProducts =  async () => {
    try {
        const response = await axios.get('http://localhost:5001/api/products')
        const results = response.data;

        setProducts(results)
    } catch(error) {
        throw(error)
    } 
  }

  const addProductToCart = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/cart/add', {
        userId: userId,
        productId: productId,
        quantity: quantity
      })
      const results = response.data;

      Swal.fire({
        icon: "success",
        text: "Item Added",
      })
    
    } catch(error) {
        throw(error)
    } 
  }

  useEffect(() => {
    setUserId(window.localStorage.userId); 
    fetchProducts()
  }, [])

  return (
    <div className="shop">
        <h1 className='shop-page-h1'>Shop All</h1>
        <div className='products-container'> {
            products.map((currentItem, index) => { 
                return <li className="card" key={index}>
                            <img className="product-image" src={currentItem[5]} alt="product"/>
                            <p className='product-title'>
                                {currentItem[1]}
                                <br></br>
                                ${currentItem[3]}
                                <br></br>
                                <button
                                  className="btn add-product"
                                  onClick={() => {
                                    setProductId(currentItem[0]);
                                    setQuantity((prevQuantity) => prevQuantity + 1)
                                    addProductToCart()
                                    }
                                  }
                                >Add Item to Cart</button>
                            </p>
                        </li>
            })}
        </div>
        <div className='spacing-div'></div>
    </div>
  );
}

export default Shop;