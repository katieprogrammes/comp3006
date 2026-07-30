import React, { useState } from 'react';
import axios from 'axios';

const Register = ({setLoggedInUser, setCurrentPage}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState("");

    const { name, email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:9000/auth/register', 
            {
                name,
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setLoggedInUser(res.data.user);
            setMessage('Registered successfully');

            setCurrentPage("dashboard");
        } catch (err) {
            console.error(err.response.data || err.message);
            setMessage('Failed to register, User already exists');
        }
    };

    return (
        <div className="auth-form">
            <h2 className="text-center">Register</h2>
            <form onSubmit={onSubmit}>
                <input type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Name" name="name" 
                    value={name} 
                    onChange={onChange} 
                    required />
                <input type="email" 
                    className="form-control form-control-lg" 
                    placeholder="Email" 
                    name="email" 
                    value={email} 
                    onChange={onChange} 
                    required />
                <input type="password" 
                    className="form-control form-control-lg" 
                    placeholder="Password" name="password" 
                    value={password} onChange={onChange} 
                    required />
                <button type="submit" className="btn btn-lg account-button">Register</button>
            </form>
            <p className="message">{message}</p>
            <p className="text-center">
                Already have an account?
                <button type="button" className="btn btn-lg account-button" onClick={() => setCurrentPage("login")}>
                    Login
                </button>
            </p>
            <button type="button" className="btn btn-lg account-button" onClick={() => setCurrentPage("home")}>
                Back to Home
            </button>
        </div>
    );
};

export default Register;