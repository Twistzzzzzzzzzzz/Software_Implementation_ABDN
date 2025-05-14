import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { assets } from '../../assets/assets';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can add actual authentication logic here
        console.log('Login attempt with:', email, password);
        // For now, simply navigate to home page on submit
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-container">
                    <img src={assets.web_icon} alt="Psychology Logo" className="logo" />
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Value"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Value"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="sign-in-button">Sign In</button>
                    
                    <div className="links-container">
                        <div className="forgot-link">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                        <div className="register-link">
                            <span>Register an account?</span>
                            <Link to="/register">Click here!</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
