import { useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import './deleteproduct.css';

function DeleteProduct({navigate}) {
    const [productId, setProductId] = useState(0);

    const handleDeleteProduct = async (ev) => {
        ev.preventDefault();
        try {
            const response = await axios.delete('http://localhost:5001/api/products/delete', {
                headers: {
                  'Content-Type': 'application/json',
                },
                data: {
                  product_id: productId,
                },
              });
              
            const results = response.data;
            console.log(results)

            if(results.message === "Product successfully deleted."){
                swal({
                    icon: "success",
                })
                navigate("/")
            }
        } catch(error) {
            swal({
                title: "Product deletion failed.",
                text: "Please make sure the product id is correct, and try again."
              });
        }
    }

    return (
        <div class="container">
            <h1>Delete Product</h1>
            <form
                onSubmit={
                    handleDeleteProduct
                }
            >
            <div className="form-group">
                <label for="name">Product Id</label>
                <input 
                type="number" 
                id="name" 
                name="name" 
                required
                onChange={(ev) => {
                    ev.preventDefault();
                    setProductId(ev.target.value);
                }}
                 />
            </div>
            <input type="submit" value="Delete Product" />
            </form>
        </div>
    );
}

export default DeleteProduct;