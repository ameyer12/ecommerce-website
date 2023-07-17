import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'
import './register.css';

function Register({navigate, registerUser}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
 
    const handleRegister = async (ev) => {
        ev.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/users/register', {
                username: username,
                email: email,
                password: password,
                isAdmin: isAdmin
            })
            const results = response.data;
            window.localStorage.setItem('token', results.token);
            window.localStorage.setItem('admin', results.isAdmin);

            if(results.message === "User successfully created"){
                Swal.fire({
                    icon: "success",
                    text: results.message,
                })
                navigate("/")
            } else if(results.message === "Registration failed. Email already exists."){
                Swal.fire({
                    title: "Registration failed.",
                    text: "An account with this email already exists."
                });
            }
        } catch(error) {
            Swal.fire({
                title: "Registration failed.",
                text: "An account with this email already exists."
              });
        }
    }
    
    return (
    <div className="container">
        <h1>Register</h1>
        <form 
            onSubmit={
                handleRegister
            }
        >
        <div className="form-group">
            <label for="username">Username</label>
            <input 
            type="username" 
            id="username" 
            placeholder="Enter your username" 
            required
            onChange={(ev) => {
                ev.preventDefault();
                setUsername(ev.target.value)
            }} 
            />
        </div>
        <div className="form-group">
            <label for="email">Email Address</label>
            <input 
            type="email" 
            id="email" 
            placeholder="Enter your email address" 
            required 
            onChange={(ev) => {
                ev.preventDefault();
                setEmail(ev.target.value)
            }} 
            />
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input 
            type="password" 
            id="password" 
            placeholder="Enter your password" 
            required
            onChange={(ev) => {
                ev.preventDefault();
                setPassword(ev.target.value)
            }} 
             />
        </div>
        <div className="form-group">
            <button type="submit">Register</button>
        </div>
        </form>
    </div>
    );
}

export default Register;