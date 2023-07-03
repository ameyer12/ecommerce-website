import { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import './login.css';

function Login({navigate}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (ev) => {
        ev.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/users/login', {
                email: email,
                password: password,
            })
            const results = response.data;

            window.localStorage.setItem('token', results.token);

            if(results.message === "User successfully logged in."){
                swal({
                    icon: "success",
                })
                navigate("/")
            } else if(results.message === "Login failed. Unauthorized access."){
                swal({
                    title: "Login failed.",
                    text: "Invalid credentials."
                });
            }
        } catch(error) {
            swal({
                title: "Login failed.",
                text: "Invalid credentials."
              });
        }
    }
    const token = window.localStorage.token;

    if(token === undefined){
        return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={
                handleLogin
            }>
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
            <div className="form-group">
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
                <button type="submit">Login</button>
                <p className="registration-link">Don't have an account?<a href="/register">Register</a></p>
            </div>
            </form>
        </div>
        );
    } else {
        return (
            <div id="account-page">
            <p id="account-page-p">My Account</p>
            <div className="card">
                <div className="card-body">
                    <p className="card-text">Order History</p>
                    <p className="card-text">Manage Addresses</p>
                    <p className="card-text">Account Details</p>
                </div>
            </div>
            <button
            type="submit"
            id="sign-out-button" 
            className="btn btn-primary"
            onClick={() => {
                console.log("Hello, world")
            }}
            >Sign Out</button>
        </div>
        );
    }
}

export default Login;