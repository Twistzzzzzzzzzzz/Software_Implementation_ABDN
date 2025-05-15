import ReactPlayer from 'react-player'
import { assets } from '../../assets/assets'
import './Healing_vedio.css'
import CommentArea from "./components/CommentArea/CommentArea.jsx";
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VideoItem from './components/VideoItem/VideoItem.jsx';
import SidebarTabs from './components/SidebarTabs/SidebarTabs.jsx';

export default function Healing_video({ videoTitle, videoDescription }) {
    const videoUrl = assets.Super_idol_video
    const topRef = useRef(null);
    const location = useLocation();
    useEffect(() => {
        if (location.state && location.state.scrollToTop && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [location]);

    // 示例数据
    const videoList = [
        {
            id: 1,
            previewImg: assets.ServiceCard1,
            title: '给我们的组合起个名！',
        },
        {
            id: 2,
            previewImg: assets.ServiceCard2,
            title: '心理治愈短片',
        },
        {
            id: 3,
            previewImg: assets.ServiceCard3,
            title: '冥想放松音乐',
        },
        {
            id: 4,
            previewImg: assets.ServiceCard4,
            title: '正念呼吸练习',
        },
    ];
    const [videoItems] = useState(videoList.slice(0, 4));

    const defaultVideoTitle = "给我们的组合起个名！"
    const defaultVideoDescription = "田一鸣让来自美国的speed露出了中国行成都站最开心的笑容。\n" +
        "组合名为：逗美尼的田"

    const displayTitle = videoTitle || defaultVideoTitle
    const displayDescription = videoDescription || defaultVideoDescription

    return (
        <div className="video-page">
            <div ref={topRef}></div>
            <div className="video-main-layout">
                <div className="video-content-area">
                    <div className="video-container">
                        <div className="player-wrapper">
                            <ReactPlayer
                                url={videoUrl}
                                width="100%"
                                height="100%"
                                controls={true}
                                className="react-player"
                            />
                        </div>
                        {/*<div className="video-actions">*/}
                        {/*    <button className="action-button">*/}
                        {/*        <img src={assets.Like_icon} alt="Like" />*/}
                        {/*        <span>点赞</span>*/}
                        {/*    </button>*/}
                        {/*    <button className="action-button">*/}
                        {/*        <img src={assets.Star_icon} alt="Star" />*/}
                        {/*        <span>收藏</span>*/}
                        {/*    </button>*/}
                        {/*    <button className="action-button">*/}
                        {/*        <img src={assets.Share_icon} alt="Share" />*/}
                        {/*        <span>分享</span>*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <SidebarTabs
                    videoTitle={displayTitle}
                    videoDescription={displayDescription}
                    videoItems={videoItems}
                >
                    <CommentArea />
                </SidebarTabs>
            </div>
        </div>
    )
}