import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './editproduct.css';

function EditProduct({navigate}) {
    const [productId, setProductId] = useState(0);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);


    const handleEditProduct = async (ev) => {
        ev.preventDefault();
        try {
            const response = await axios.patch('https://ecommerce-website-60o8.onrender.com/api/products/update', {
                product_id: productId,
                name: name || undefined,
                image: image || undefined,
                description: description || undefined,
                price: price || undefined,
                quantity: quantity || undefined
            })
            const results = response.data;

            if(results.message === "Product successfully updated"){
                Swal.fire({
                    icon: "success",
                    text: results.message,
                })
                navigate("/")
            } 
        } catch(error) {
            Swal.fire({
                title: "Product update failed.",
                text: "Please try again."
              });
        }
    }

    return (
        <div class="container">
            <h1>Edit a Product</h1>
            <form
                onSubmit={
                    handleEditProduct
                }
            >
            <div className="form-group">
                <label for="name">Product Id</label>
                <input 
                type="text" 
                id="name" 
                name="name"
                required 
                onChange={(ev) => {
                    ev.preventDefault();
                    setProductId(ev.target.value);
                }}
                />
            </div>
            <div className="form-group">
                <label for="name">Update Product Name</label>
                <input 
                type="text" 
                id="name" 
                name="name" 
                onChange={(ev) => {
                    ev.preventDefault();
                    setName(ev.target.value);
                }}
                 />
            </div>
            <div className="form-group">
                <label for="name">Product Image URL</label>
                <input 
                type="text" 
                id="name" 
                name="name" 
                onChange={(ev) => {
                    ev.preventDefault();
                    setImage(ev.target.value);
                }}
                />
            </div>
            <div className="form-group">
                <label for="name">Product Description</label>
                <input 
                type="text" 
                id="name" 
                name="name" 
                onChange={(ev) => {
                    ev.preventDefault();
                    setDescription(ev.target.value);
                }}
                />
            </div>
            <div className="form-group">
                <label for="name">Product Price</label>
                <input 
                type="number" 
                id="name" 
                name="name" 
                onChange={(ev) => {
                    ev.preventDefault();
                    setPrice(ev.target.value);
                }}
                />
            </div>
            <div className="form-group">
                <label for="name">Product Quantity</label>
                <input 
                type="number" 
                id="name" 
                name="name" 
                onChange={(ev) => {
                    ev.preventDefault();
                    setQuantity(ev.target.value);
                }}
                />
            </div>
            <input type="submit" value="Add Product" />
            </form>
        </div>
    );
}

export default EditProduct;