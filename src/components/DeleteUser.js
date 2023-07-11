import { useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import './deleteuser.css';

function DeleteUser({navigate}) {
    const [email, setEmail] = useState(0);

    const handleDeleteUser = async (ev) => {
        ev.preventDefault();
        try {
            const response = await axios.delete('http://localhost:5001/api/users/delete', {
                headers: {
                  'Content-Type': 'application/json',
                },
                data: {
                  email: email,
                },
              });
              
            const results = response.data;
            console.log(results)

            if(results.message === "User successfully deleted."){
                swal({
                    icon: "success",
                })
                navigate("/")
            }
        } catch(error) {
            swal({
                title: "User deletion failed.",
                text: "Please make sure the email is correct, and try again."
              });
        }
    }

    return (
        <div class="container">
            <h1>Delete User</h1>
            <form
                onSubmit={
                    handleDeleteUser
                }
            >
            <div className="form-group">
                <label for="name">Email</label>
                <input 
                type="text" 
                id="name" 
                name="name" 
                required
                onChange={(ev) => {
                    ev.preventDefault();
                    setEmail(ev.target.value);
                }}
                 />
            </div>
            <input type="submit" value="Delete User" />
            </form>
        </div>
    );
}

export default DeleteUser;