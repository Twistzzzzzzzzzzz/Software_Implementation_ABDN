import { useState, useEffect, lazy, Suspense } from 'react'
import { assets } from '../../assets/assets'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import Profile from '../Profile/Profile'
import request from '../../utils/request'

// Lazy load images
const LazyImage = lazy(() => import('../LazyImage/LazyImage'))

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [userAvatar, setUserAvatar] = useState(localStorage.getItem('user_avatar'))
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    // 判断是否已登录（以access_token为准）
    const isLoggedIn = !!localStorage.getItem('access_token');

    useEffect(() => {
        // Preload images
        const imageLoader = new Image()
        imageLoader.src = assets.web_icon
        const personalIconLoader = new Image()
        personalIconLoader.src = assets.Personal_icon

        Promise.all([
            new Promise(resolve => { imageLoader.onload = resolve }),
            new Promise(resolve => { personalIconLoader.onload = resolve })
        ]).then(() => {
            setImagesLoaded(true)
        })
    }, [])

    useEffect(() => {
        async function fetchUserInfo() {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token') || '';
                const res = await request.get('/api/v1/user/info', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // 直接用res（axios已自动解包）
                if (res && res.code === 0 && res.data) {
                    setUsername(res.data.username || '');
                    setPassword(res.data.password || '');
                    setAvatar(res.data.avatar && res.data.avatar.trim() !== '' ? res.data.avatar : null);
                    setEmail(res.data.email || '');
                }
            } catch (e) {
                // 错误处理
            } finally {
                setLoading(false);
            }
        }
        fetchUserInfo();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleLoginClick = () => {
        navigate('/login');
    }

    const handleProfileClick = () => {
        setShowProfile(true);
    }

    const handleCloseProfile = () => {
        setShowProfile(false);
        setUserAvatar(localStorage.getItem('user_avatar'));
    }

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="navbar">
            <Suspense fallback={<div className="skeleton" style={{ width: '35px', height: '35px' }}></div>}>
                {imagesLoaded ? (
                    <LazyImage src={assets.web_icon} alt="Website Icon" className="web_icon" />
                ) : (
                    <div className="skeleton" style={{ width: '35px', height: '35px' }}></div>
                )}
            </Suspense>

            <div className="hamburger" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <ul className={isMenuOpen ? 'active' : ''}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="ai-chat">AI chat</Link></li>
                <li><Link to="healing-vedio">Healing Videos</Link></li>
                <li><Link to="self-psycho">Self-psychological test</Link></li>
                <li><Link to="articles">Articles</Link></li>
                <li><Link to="community">Community</Link></li>
            </ul>

            <div className="navbar_right">
                <Suspense fallback={<div className="skeleton" style={{ width: '35px', height: '35px' }}></div>}>
                    {imagesLoaded ? (
                        <span onClick={handleProfileClick} style={{display:'inline-block'}}>
                            <img
                                src={userAvatar || assets.Personal_icon}
                                alt="Personal Icon"
                                className="personal_icon"
                                style={{width:'35px',height:'35px',borderRadius:'50%',objectFit:'cover'}}
                            />
                        </span>
                    ) : (
                        <div className="skeleton" style={{ width: '35px', height: '35px' }}></div>
                    )}
                </Suspense>
                {isLoggedIn ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <button onClick={handleLoginClick}>Login</button>
                )}
            </div>
            {showProfile && <Profile onClose={handleCloseProfile} />}
        </div>
    )
}