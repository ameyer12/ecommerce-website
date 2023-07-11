import { useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';

function AddProduct({navigate}) {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const handleAddProduct = async (ev) => {
        ev.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/products', {
                name: name,
                image: image,
                description: description,
                price: price,
                quantity: quantity
            })
            const results = response.data;
            console.log(results)

            if(results.message === "Product successfully created"){
                swal({
                    icon: "success",
                })
                navigate("/")
            } 
        } catch(error) {
            swal({
                title: "Product creation failed.",
                text: "Please try again."
              });
        }
    }

    return (
        <div class="container">
            <h1>Add Product</h1>
            <form
                onSubmit={
                    handleAddProduct
                }
            >
            <div className="form-group">
                <label for="name">Product Name</label>
                <input 
                type="text" 
                id="name" 
                name="name" 
                required
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
                required
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
                required
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
                required
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
                required 
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

export default AddProduct;