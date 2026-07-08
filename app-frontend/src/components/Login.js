import React, { useState } from 'react';
import axios from 'axios';
import './style.css'; // Import CSS for styling

const Login = ({ setLoggedInUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, 
                                      [e.target.name]: e.target.value });

    const onSubmit = async e => {
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
            setLoggedInUser(email);
            
            // Set success message
            setMessage('Logged in successfully');
        } catch (err) {
            console.error(err.response.data);
            // Set error message
            setMessage('Failed to login - wrong credentials');         
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <input type="email" 
                       placeholder="Email" 
                       name="email" 
                       value={email} 
                       onChange={onChange} 
                       required />
                <input type="password" 
                       placeholder="Password" 
                       name="password" 
                       value={password} 
                       onChange={onChange} 
                       required />
                <button type="submit">Login</button>
            </form>
            <p className="message">{message}</p>
        </div>
    );
};

export default Login;