import { useState, useEffect } from 'react';
import axios from 'axios';
import './shop.css';

function Shop() {

  const [products, setProducts] = useState([]);

  const fetchProducts =  async () => {
    try {
        const response = await axios.get('http://localhost:5001/api/products')
        const results = response.data;

        setProducts(results)
    } catch(error) {
        throw(error)
    } 
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="shop">
        <h1 className='shop-page-h1'>Shop All</h1>
        <div className='products-container'> {
            products.map((currentItem, index) => { 
                console.log(currentItem)
                return <li className="card" key={index}>
                            <img className="product-image" src={currentItem[5]} alt="product image"/>
                            <p className='product-title'>
                                {currentItem[1]}
                                <br></br>
                                ${currentItem[3]}
                                <br></br>
                                <button className="btn add-product" href={`/products/${currentItem.id}`}>Add Item to Cart</button>
                            </p>
                        </li>
            })}
        </div>
        <div className='spacing-div'></div>
    </div>
  );
}

export default Shop;