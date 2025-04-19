import ReactPlayer from 'react-player'
import { assets } from '../../assets/assets'
import './Healing_vedio.css'
import CommentArea from "./components/CommentArea/CommentArea.jsx";

export default function Healing_video({ videoTitle, videoDescription }) {
    const videoUrl = assets.Super_idol_video

    // 示例数据
    const defaultVideoTitle = "给我们的组合起个名！"
    const defaultVideoDescription = "田一鸣让来自美国的speed露出了中国行成都站最开心的笑容。\n" +
        "组合名为：逗美尼的田"

    const displayTitle = videoTitle || defaultVideoTitle
    const displayDescription = videoDescription || defaultVideoDescription

    return (
        <div className="video-page">
            <div className='mainContent'>
                <div className="video-container">
                    <div className="video-info">
                        <h1 className="video-title">{displayTitle}</h1>
                        <p className="video-description">{displayDescription}</p>
                    </div>

                    <div className="player-wrapper">
                        <ReactPlayer
                            url={videoUrl}
                            width="100%"
                            height="100%"
                            controls={true}
                            className="react-player"
                        />
                    </div>

                    <div className="video-actions">
                        <button className="action-button">
                            <img src={assets.Like_icon} alt="Like" />
                            <span>点赞</span>
                        </button>
                        <button className="action-button">
                            <img src={assets.Star_icon} alt="Star" />
                            <span>收藏</span>
                        </button>
                        <button className="action-button">
                            <img src={assets.Share_icon} alt="Share" />
                            <span>分享</span>
                        </button>
                    </div>
                </div>
                <CommentArea></CommentArea>
            </div>
        </div>
    )
}