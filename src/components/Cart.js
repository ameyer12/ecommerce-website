import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './cart.css';


function Cart() {
    const [cart, setCart] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [orderItemId, setOrderItemId] = useState(0);

    const userId = window.localStorage.userId;

    const fetchCart = async () => {
        try {
            const response = await axios.get(`/api/cart/${userId}`)
            const results = response.data;
    
            setCart(results);
        } catch(error) {
            throw(error)
        } 
    }

    const calculateSubtotal = (cart) => {
        let subtotal = 0;

        if (!cart || cart.length === 0) {
            setSubtotal(0);
            return 0;
        }

        for(let i = 0; i < cart.length; i++){
            subtotal += parseInt(cart[i][2]);
        }

        setSubtotal(subtotal);
    }

    const removeProductFromCart = async (orderItemId) => {
        try {
            const response = await axios.delete(`/api/cart/${orderItemId}`);
            const results = response.data;
            
            fetchCart();

            Swal.fire({
                icon: "success",
                text: "Item Removed",
              });

        } catch(error) {
            throw(error)
        } 
    }

    useEffect(() => {
        fetchCart();
    }, [])

    useEffect(() => {
        calculateSubtotal(cart);
      }, [cart]);

    return (
        <div className='cart-page'>
            <h1 className='cart-h1'>My Cart</h1>
            <p className='subtotal'>Subtotal: ${subtotal}</p>
            <div> {
                cart.map((currentItem, index) => {
                    return <li className="card cart-card" key={index}>
                                <p className='product-id'>{currentItem[1]}</p>
                                <p className='product-price'>$ {currentItem[2]}</p>
                                <button 
                                className='btn remove-item-button'
                                onClick={() => {
                                    setOrderItemId(currentItem[0]);
                                    removeProductFromCart(currentItem[0]);
                                  }
                                }
                                >Remove Item</button>
                            </li>
                }
                ) 
            }
            </div>
            <button className='btn check-out-button'>Check Out</button>
        </div>
    );
}

export default Cart;