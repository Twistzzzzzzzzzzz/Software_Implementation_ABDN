import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { assets } from '../../assets/assets';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:4523/m1/6378312-6074650-default/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok && data.code === 0) {
                // 登录成功，保存 access_token 并跳转首页
                localStorage.setItem('access_token', data.data?.access_token || '');
                // 保存 refresh_token
                // localStorage.setItem('refresh_token', data.data?.refresh_token || '');
                navigate('/');
            } else {
                setApiError(data.message || 'Login failed.');
            }
        } catch (err) {
            setApiError('Network error, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-container">
                    <img src={assets.web_icon} alt="Psychology Logo" className="logo" />
                </div>
                <form onSubmit={handleSubmit}>
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
                    {apiError && <p className="error-message">{apiError}</p>}
                    <button type="submit" className="sign-in-button" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
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
