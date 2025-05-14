import { useState, useEffect, lazy, Suspense } from 'react'
import { assets } from '../../assets/assets'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'

// Lazy load images
const LazyImage = lazy(() => import('../LazyImage/LazyImage'))

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const navigate = useNavigate();

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleLoginClick = () => {
        navigate('/login');
    }

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
                <li><Link to="contact">Contact us</Link></li>
                <li><Link to="community">Community</Link></li>
            </ul>

            <div className="navbar_right">
                <Suspense fallback={<div className="skeleton" style={{ width: '35px', height: '35px' }}></div>}>
                    {imagesLoaded ? (
                        <LazyImage src={assets.Personal_icon} alt="Personal Icon" className="personal_icon" />
                    ) : (
                        <div className="skeleton" style={{ width: '35px', height: '35px' }}></div>
                    )}
                </Suspense>
                <button onClick={handleLoginClick}>Login</button>
            </div>
        </div>
    )
}