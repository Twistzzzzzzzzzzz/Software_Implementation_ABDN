import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { assets } from '../../assets/assets';
import env from '../../config/env';
import request from '../../utils/request';
import { useAuthPrompt } from '../../context/AuthPromptContext';


export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showPrompt } = useAuthPrompt();

    const validateForm = () => {
        // Basic validation
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            showPrompt('Passwords do not match');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const data = await request.post('/api/v1/auth/register', { username, password, email });
            if (data.code === 0) {
                showPrompt('Registration successful! Please log in.');
                navigate('/login');
            } else {
                showPrompt(data.message || 'Registration failed.');
            }
        } catch (err) {
            showPrompt(err.message || 'Network error, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="logo-container">
                    <img src={assets.web_icon} alt="Psychology Logo" className="logo" />
                </div>
                <h2 className="page-title">Register</h2>
                
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
                    </div>
                    
                    <button type="submit" className="sign-in-button" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                    
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