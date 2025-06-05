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

    useEffect(() => {
        // 获取用户信息
        async function fetchUserInfo() {
            setLoading(true);
            try {
                const res = await request.get('/api/v1/user/info');
                const data = await res.data;
                if (res.ok && data.code === 0 && data.data) {
                    setUsername(data.data.username || '');
                    setPassword(data.data.password || '');
                    setAvatar(data.data.avatar || null);
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
            await request.put('/api/v1/user/info', {
                update_username: username,
                update_password: password,
                update_avater: update_avatar || null,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
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
                        src={avatar || defaultAvatar}
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
                    <button type="submit" className="profile-save-btn" disabled={loading || saving}>{saving ? 'Saving...' : loading ? 'Loading...' : 'Save'}</button>
                </form>
            </div>
        </div>
    );
} 