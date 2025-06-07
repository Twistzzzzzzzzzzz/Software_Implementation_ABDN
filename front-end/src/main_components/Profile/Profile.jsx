import React, { useState, useRef, useEffect } from 'react';
import './Profile.css';
import defaultAvatar from '../../assets/UserAvatar.png';
import request from '../../utils/request';

export default function Profile({ onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null); // 头像URL或base64
    const [avatarFile, setAvatarFile] = useState(null); // 头像文件对象
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef();
    const [email, setEmail] = useState('');

    useEffect(() => {
        // 获取用户信息
        async function fetchUserInfo() {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token') || '';
                const res = await request.get('/api/v1/user/info', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res && res.code === 0 && res.data) {
                    setUsername(res.data.username || '');
                    setPassword(res.data.password || '');
                    const avatarValue = res.data.avatar && res.data.avatar.trim() !== '' ? res.data.avatar : null;
                    setAvatar(avatarValue);
                    setEmail(res.data.email || '');
                    // 存储头像到localStorage，Navbar可实时读取
                    if (avatarValue) {
                        localStorage.setItem('user_avatar', avatarValue);
                    } else {
                        localStorage.removeItem('user_avatar');
                    }
                }
            } catch (e) {
                // 错误处理
            } finally {
                setLoading(false);
            }
        }
        fetchUserInfo();
    }, []);

    // 将图片文件转为base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        setSaving(true);
        let update_avatar = avatar;
        if (avatarFile) {
            // 新上传的头像转base64
            update_avatar = await fileToBase64(avatarFile);
        }
        try {
            const token = localStorage.getItem('access_token') || '';
            const res = await request.put('http://localhost:8080/api/v1/user/update', {
                username: username,
                password: password,
                avatar: update_avatar || '',
                email: email,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // 渲染返回的用户信息
            if (res && res.code === 0 && res.data) {
                setUsername(res.data.username || '');
                const avatarValue = res.data.avatar && res.data.avatar.trim() !== '' ? res.data.avatar : null;
                setAvatar(avatarValue);
                setEmail(res.data.email || '');
                // 存储头像到localStorage，Navbar可实时读取
                if (avatarValue) {
                    localStorage.setItem('user_avatar', avatarValue);
                } else {
                    localStorage.removeItem('user_avatar');
                }
            }
            // 成功提示
            onClose();
        } catch (e) {
            // 错误处理
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatar(url);
            setAvatarFile(file);
        }
    };

    return (
        <div className="profile-modal-overlay">
            <div className="profile-modal profile-edit-style">
                <button className="profile-close" onClick={onClose}>&times;</button>
                {/*<div className="profile-title">Edit Profile</div>*/}
                <div className="profile-avatar-section">
                    <img
                        src={avatar ? avatar : defaultAvatar}
                        alt="avatar"
                        className="profile-avatar"
                        onClick={handleAvatarClick}
                        style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        disabled={loading}
                    />
                </div>
                <form className="profile-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <label htmlFor="profile-username">Username</label>
                    <input id="profile-username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" disabled={loading || saving} />
                    <label htmlFor="profile-password">Password</label>
                    <input id="profile-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" disabled={loading || saving} />
                    <label htmlFor="profile-email">Email</label>
                    <input id="profile-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" disabled={loading || saving} />
                    <button type="submit" className="profile-save-btn" disabled={loading || saving}>{saving ? 'Saving...' : loading ? 'Loading...' : 'Save'}</button>
                </form>
            </div>
        </div>
    );
} 