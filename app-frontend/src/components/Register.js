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
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="name" name="name" value={name} onChange={onChange} required />
                <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Register</button>
            </form>
            <p className="message">{message}</p>
            <button type="button" onClick={() => setCurrentPage("home")}>
                Back to Home
            </button>

            <p>
                Already have an account?{" "}
                <button type="button" onClick={() => setCurrentPage("login")}>
                    Login
                </button>
            </p>
        </div>
    );
};

export default Register;