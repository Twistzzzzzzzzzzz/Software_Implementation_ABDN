import {assets} from "../../assets/assets.js"
import ServiceCard from './components/serviceCard/serviceCard.jsx'
import MembershipCard from "./components/membershipCard/membershipCard.jsx";
import PopularCard from "./components/popularCard/popularCard.jsx";
import ReactPlayer from 'react-player'
import './Home.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import request from '../../utils/request';

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const topRef = useRef(null);
    const serviceRef = useRef(null);
    const [video, setVideo] = useState(null);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        async function fetchVideo() {
            try {
                const res = await request.get('/api/v1/resources/video/67');
                const data = res.data;
                if (data) {
                    setVideo(data);
                }
            } catch (e) {
                setVideo(null);
            }
        }
        fetchVideo();
    }, []);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await request.get('/api/v1/resources/articles', { params: { size: 4, page: 1 } });
                const data = res.data;
                if (data && data.items) {
                    setArticles(data.items);
                }
            } catch (e) {
                setArticles([]);
            }
        }
        fetchArticles();
    }, []);

    // 跳转并传递scrollToTop信号
    const handleNavigate = (path) => {
        navigate(path, { state: { scrollToTop: true } });
    };
    // Learn More 滚动到服务区
    const handleLearnMore = () => {
        if (serviceRef.current) {
            serviceRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    // Learn More 跳转到Healing_video并传递videoId
    const handleLearnMoreVideo = () => {
        if (video) {
            navigate('/healing-vedio', { state: { videoId: video.video_id } });
        }
    };
    // 页面加载后检测是否需要滚动到顶部
    useEffect(() => {
        if (location.state && location.state.scrollToTop && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [location]);

    return (
        <div className='body'>
            <div ref={topRef}></div>
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
                        <button className="learn-more" onClick={handleLearnMore}>Learn More</button>
                    </div>
                    <div className="welcome-image">
                        <img src={assets.Home_image} alt="Welcome illustration" />
                    </div>
                </div>
            </div>
            <hr/>
            <div className='serviceContainer' ref={serviceRef}>
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
                        onClick={() => handleNavigate('/community')}
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
                            {video && video.content_address ? (
                                <ReactPlayer
                                    url={video.content_address}
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                    className="react-player"
                                />
                            ) : (
                                <div style={{textAlign: 'center', padding: '40px 0'}}>暂无视频资源</div>
                            )}
                        </div>
                        {video && (
                            <button className="learn-more" onClick={handleLearnMoreVideo} style={{marginTop: '16px'}}>Learn More</button>
                        )}
                    </div>
                    <div className="popular-section">
                        <div className="section-header">
                            <img src={assets.PopularIcon} alt="Popular icon" />
                            <h2>Popular Article</h2>
                        </div>
                        <div className="popular-list">
                            {articles.map((item, idx) => (
                                <PopularCard
                                    key={item.article_id || idx}
                                    number={idx + 1}
                                    title={item.title}
                                    summary={item.summary}
                                    published_at={item.published_at}
                                    articleData={item}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/*<hr/>*/}
            {/*<div className='membership-container'>*/}
            {/*    <div className='websiteIcon'>*/}
            {/*        <div className="home_web_info">*/}
            {/*            <img src={assets.web_icon} alt=""  className='web_icon'/>*/}
            {/*            <span className="home_website_name">Lighthouse Minds</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="membership-section">*/}
            {/*        <div className="membership-cards">*/}
            {/*            <MembershipCard*/}
            {/*                theme="light"*/}
            {/*                price={19}*/}
            {/*                period="/ mo"*/}
            {/*                description="Basic Plan: Perfect for first-time users to experience psychological services, including basic assessments and limited AI conversations."*/}
            {/*                features={[*/}
            {/*                    'One mental health test per month',*/}
            {/*                    '5 AI conversations per day',*/}
            {/*                    'Free access to selected psychological videos',*/}
            {/*                    'Basic community privileges',*/}
            {/*                ]}*/}
            {/*                buttonText="Subscribe Basic"*/}
            {/*            />*/}
            {/*            <MembershipCard*/}
            {/*                theme="dark"*/}
            {/*                price={50}*/}
            {/*                period="/ mo"*/}
            {/*                description="Premium Plan: Enjoy comprehensive psychological services and more AI conversations, ideal for ongoing needs."*/}
            {/*                features={[*/}
            {/*                    'One mental health test per week (any type)',*/}
            {/*                    '20 AI conversations per day',*/}
            {/*                    'Free access to all psychological counseling videos',*/}
            {/*                    'Exclusive community badges and practical courses',*/}
            {/*                ]}*/}
            {/*                buttonText="Upgrade to Premium"*/}
            {/*            />*/}
            {/*            <MembershipCard*/}
            {/*                theme="light"*/}
            {/*                price={99}*/}
            {/*                period="/ year"*/}
            {/*                description="Annual VIP Plan: Unlimited services for a whole year, with a dedicated psychological consultant and customized content."*/}
            {/*                features={[*/}
            {/*                    'Unlimited mental health tests throughout the year',*/}
            {/*                    'Unlimited AI conversations',*/}
            {/*                    'One-on-one exclusive psychological consultant',*/}
            {/*                    'Customized psychological growth courses',*/}
            {/*                ]}*/}
            {/*                buttonText="Enjoy Annual VIP"*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<hr/>*/}
        </div>
    )
}

export default Home
