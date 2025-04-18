import { assets } from '../../assets/assets'
import './Navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <div className = "navbar">
            <img src={assets.web_icon} alt=""  className='web_icon'/>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="ai-chat">AI chat</Link></li>
                <li><Link to="healing-vedio">Healing Videos</Link></li>
                <li><Link to="self-psycho">Self-psychological test</Link></li>
                <li><Link to="contact">Contact us</Link></li>
                <li><Link to="community">Community</Link></li>

            </ul>
            <div className='navbar_right'>
                <img src={assets.Personal_icon} alt="" className='personal_icon'/>
                <button>Login</button>
            </div>
            
        </div>
    )
}