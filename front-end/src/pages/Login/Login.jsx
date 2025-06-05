import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { assets } from '../../assets/assets';
import env from '../../config/env';
import request from '../../utils/request';

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
            const data = await request.post('/api/v1/auth/login', {
                username,
                password,
            });
            if (data.code === 0) {
                // 登录成功，保存 token
                localStorage.setItem('access_token', data.data?.access_token || '');
                localStorage.setItem('refresh_token', data.data?.refresh_token || '');
                navigate('/');
            } else {
                setApiError(data.message || '登录失败。');
            }
        } catch (err) {
            setApiError('网络错误，请重试。');
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
