import {assets} from "../../assets/assets.js"
import ServiceCard from './components/serviceCard/serviceCard.jsx'
import MembershipCard from "./components/membershipCard/membershipCard.jsx";
import PopularCard from "./components/popularCard/popularCard.jsx";
import ReactPlayer from 'react-player'
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
                        img={assets.Service_card}
                        title="AI Chat"
                        desc="Chat with our advanced AI for psychological support and advice."
                        buttonText="Begin Chat"
                    />
                    <ServiceCard
                        img={assets.Test_main_bg}
                        title="Self Test"
                        desc="Take a variety of psychological self-assessment tests."
                        buttonText="Start Test"
                    />
                    <ServiceCard
                        img={assets.VideoPlayImage}
                        title="Healing Videos"
                        desc="Watch curated videos to help you relax and heal."
                        buttonText="Watch Now"
                    />
                    <ServiceCard
                        img={assets.PopularIcon}
                        title="Healing Message Wall"
                        desc="Explore trending topics and discussions in our community."
                        buttonText="Explore"
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

