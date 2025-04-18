import {assets} from "../../assets/assets.js"
import ServiceCard from './components/serviceCard/serviceCard.jsx'
import MembershipCard from "./components/membershipCard/membershipCard.jsx";
import PopularCard from "./components/popularCard/popularCard.jsx";
import './Home.css'

function Home() {
    return (
        <div className='body'>
            <div className='welcomContainer'>
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1>Welcome to our psychological healing website</h1>
                        <p>Explore our website to understand your own psychological condition</p>
                        <div className="contact-info">
                            <div className="info-item">
                                <img src={assets.Bell_icon} alt="notification" />
                                <span>xxxxxxxxx</span>
                            </div>
                            <div className="info-item">
                                <img src={assets.Screen_icon} alt="screen" />
                                <span>xxxxxxxxx</span>
                            </div>
                        </div>
                        <button className="learn-more">Learn More</button>
                    </div>
                    <div className="welcome-image">
                        <img src={assets.Home_image} alt="Welcome illustration" />
                    </div>
                </div>
            </div>
            <hr/>
            <div className='serviceContainer'>
                <div className="service-header">
                    <div className="service-title">
                        <img src={assets.Cloud_icon} alt="Cloud icon" />
                        <h2>Our Services</h2>
                    </div>
                </div>
                <div className="service-cards">
                    <ServiceCard />
                    <ServiceCard />
                    <ServiceCard />
                    <ServiceCard />
                </div>
            </div>
            <hr/>
            <div className='todayContainer'></div>
            <div className='membership-container'></div>
        </div>
    )
}

export default Home

