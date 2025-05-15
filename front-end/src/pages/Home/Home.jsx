import {assets} from "../../assets/assets.js"
import ServiceCard from './components/serviceCard/serviceCard.jsx'
import MembershipCard from "./components/membershipCard/membershipCard.jsx";
import PopularCard from "./components/popularCard/popularCard.jsx";
import ReactPlayer from 'react-player'
import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    // 封装跳转并滚动顶部
    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };
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
                                <span>There are all kinds of daily news here</span>
                            </div>
                            <div className="info-item">
                                <img src={assets.Screen_icon} alt="screen" />
                                <span>There are also a wide variety of psychological treatment courses</span>
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
                    <ServiceCard
                        img={assets.ServiceCard1}
                        title="AI Chat"
                        desc="Engage in real-time conversations with our AI to receive instant psychological support, guidance, and a listening ear whenever you need it."
                        buttonText="Begin Chat"
                        onClick={() => handleNavigate('/ai-chat')}
                    />
                    <ServiceCard
                        img={assets.ServiceCard2}
                        title="Self Test"
                        desc="Assess your mental well-being with a variety of self-guided psychological tests and gain insights into your emotional health."
                        buttonText="Start Test"
                        onClick={() => handleNavigate('/self-psycho')}
                    />
                    <ServiceCard
                        img={assets.ServiceCard3}
                        title="Healing Videos"
                        desc="Relax and rejuvenate with our curated collection of healing and mindfulness videos designed to support your mental wellness."
                        buttonText="Watch Now"
                        onClick={() => handleNavigate('/healing-vedio')}
                    />
                    <ServiceCard
                        img={assets.ServiceCard4}
                        title="Healing Message Wall"
                        desc="Share your thoughts, read uplifting messages, and connect with a supportive community on our interactive message wall."
                        buttonText="Explore"
                        onClick={() => handleNavigate('/contact')}
                    />
                </div>
            </div>
            <hr/>
            <div className='todayContainer'>
                <div className="today-section">
                    <div className="video-section">
                        <div className="section-header">
                            <img src={assets.Video_icon} alt="Video icon" />
                            <h2>Today's healing video</h2>
                        </div>
                        <div className="video-player">
                            <ReactPlayer
                                url={assets.Super_idol_sex}
                                width="100%"
                                height="100%"
                                controls={true}
                                className="react-player"
                            />
                        </div>
                        <div className="video-actions">
                            <button className="action-button">
                                <img src={assets.Like_icon} alt="Like" />
                            </button>
                            <button className="action-button">
                                <img src={assets.Star_icon} alt="Star" />
                            </button>
                            <button className="action-button">
                                <img src={assets.Share_icon} alt="Share" />
                            </button>
                        </div>
                    </div>
                    <div className="popular-section">
                        <div className="section-header">
                            <img src={assets.PopularIcon} alt="Popular icon" />
                            <h2>Popular</h2>
                        </div>
                        <div className="popular-list">
                            <PopularCard />
                            <PopularCard />
                            <PopularCard />
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className='membership-container'>
                <div className='websiteIcon'>
                    <img src={assets.web_icon} alt=""  className='web_icon'/>
                </div>
                <div className="membership-section">
                    <div className="membership-cards">
                        <MembershipCard theme="light" />
                        <MembershipCard theme="dark" />
                        <MembershipCard theme="light" />
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    )
}

export default Home
