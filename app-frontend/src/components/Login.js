import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setLoggedInUser, setCurrentPage }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = 
                await axios.post('http://localhost:9000/auth/login', 
            {
                email,
                password
            });
            localStorage.setItem('token', res.data.token);

            console.log("Setting logged in user to:", email);

            localStorage.setItem("user", JSON.stringify(res.data.user));

            setLoggedInUser(res.data.user);
            
            setMessage('Logged in successfully');

            setCurrentPage("dashboard");
        } catch (err) {
            console.error(err.response?.data || err.message);
            // Set error message
            setMessage('Failed to login - wrong credentials');         
        }
    };

    return (
        <div className="auth-form mt-4">
            <h2 className="text-center">Login</h2>
            <form onSubmit={onSubmit}>
                <input type="email" 
                        className="form-control form-control-lg"
                       placeholder="Email" 
                       name="email" 
                       value={email} 
                       onChange={onChange} 
                       required />
                <input type="password" 
                        className="form-control form-control-lg"
                       placeholder="Password" 
                       name="password" 
                       value={password} 
                       onChange={onChange} 
                       required />
                <button type="submit" className="btn btn-lg account-button">Login</button>
            </form>

            <p className="message">{message}</p>

            <p className="text-center"> Don't have an account?</p>
                <button type="button" className="btn btn-lg account-button" onClick={() => setCurrentPage("register")}>
                    Register
                </button>
  
            <button type="button" className="btn btn-lg account-button" onClick={() => setCurrentPage("home")}>
                Back to Home
            </button>
        </div>
    );
};

export default Login;