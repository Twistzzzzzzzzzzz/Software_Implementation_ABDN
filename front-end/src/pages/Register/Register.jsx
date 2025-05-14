import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { assets } from '../../assets/assets';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        // Basic validation
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // You can add actual registration logic here
            console.log('Registration attempt with:', email, username, password);
            // For now, simply navigate to login page on submit
            navigate('/login');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
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
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Value"
                            required
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                    
                    <button type="submit" className="sign-in-button">Sign Up</button>
                    
                    <div className="links-container">
                        <div className="login-link">
                            <span>Already have an account?</span>
                            <Link to="/login">Sign in!</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 