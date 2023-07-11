import { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import './login.css';

function Login({navigate}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);


    const handleLogin = async (ev) => {
        ev.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/users/login', {
                email: email,
                password: password,
            })
            const results = response.data;
            console.log(results)

            window.localStorage.setItem('token', results.token);
            window.localStorage.setItem('admin', results.isAdmin);

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
    const admin = window.localStorage.isAdmin
    
    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            navigate("/")
        } catch (error) {
            throw error;
        }
    }

    if(token == undefined){
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
                    setIsAdmin(true)
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
    } else if (token !== undefined && admin !== false) {
        return (
            <div id="account-page">
            <h1 id="account-page-p">My Account</h1>
            <div className="card" id='account-card'>
                <div className="card-body">
                    <p className="card-text">Order History</p>
                    <p className="card-text">Manage Addresses</p>
                    <p className="card-text">Account Details</p>
                </div>
            </div>
            <button
            type="submit"
            id="admin-button" 
            className="btn btn-primary"
            onClick={() => {
                navigate("/admin")
            }}
            >Admin Page</button>
            <button
            type="submit"
            id="sign-out-button" 
            className="btn btn-primary"
            onClick={() => {
                handleLogout()
            }}
            >Sign Out</button>
        </div>
        );
    } else if (token !== undefined && admin === false){
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
                handleLogout()
            }}
            >Sign Out</button>
        </div>
        );
    }
}

export default Login;