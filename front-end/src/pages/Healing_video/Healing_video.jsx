import ReactPlayer from 'react-player'
import { assets } from '../../assets/assets'
import './Healing_vedio.css'
import CommentArea from "./components/CommentArea/CommentArea.jsx";
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VideoItem from './components/VideoItem/VideoItem.jsx';
import SidebarTabs from './components/SidebarTabs/SidebarTabs.jsx';
import env from "../../config/env.js";

export default function Healing_video({ videoTitle, videoDescription }) {
    const videoUrl = assets.Super_idol_video
    const topRef = useRef(null);
    const location = useLocation();
    useEffect(() => {
        if (location.state && location.state.scrollToTop && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [location]);

    // 视频列表请求与图片加载
    const [videoItems, setVideoItems] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [videoDetail, setVideoDetail] = useState({});

    useEffect(() => {
        async function fetchVideos() {
            try {
                const res = await fetch(`${env.backendPath}/api/v1/resources/video?size=2`);
                const data = await res.json();
                if (data && data.data && Array.isArray(data.data.items)) {
                    const itemsWithImg = await Promise.all(
                        data.data.items.map(async (item) => {
                            let previewImg = '';
                            try {
                                const imgRes = await fetch(item.pictrue_address);
                                const imgBlob = await imgRes.blob();
                                previewImg = URL.createObjectURL(imgBlob);
                            } catch (e) {
                                previewImg = assets.ServiceCard1; // fallback
                            }
                            return {
                                id: item.video_id,
                                title: item.title,
                                previewImg,
                            };
                        })
                    );
                    setVideoItems(itemsWithImg);
                    if (itemsWithImg.length > 0) {
                        setSelectedVideo(itemsWithImg[0]);
                    }
                }
            } catch (e) {
                setVideoItems([]);
            }
        }
        fetchVideos();
    }, []);

    // 获取选中视频详情和评论
    useEffect(() => {
        async function fetchVideoDetail() {
            if (!selectedVideo) return;
            try {
                const res = await fetch(`${env.backendPath}/api/v1/resources/video/${selectedVideo.id}`);
                const data = await res.json();
                if (data && data.data) {
                    setVideoDetail(data.data);
                    setComments(data.data.comment || []);
                }
            } catch (e) {
                setComments([]);
                setVideoDetail({});
            }
        }
        fetchVideoDetail();
    }, [selectedVideo]);

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
    };

    const displayTitle = videoDetail.title || videoTitle || '';
    const displayDescription = (typeof videoDetail.description === 'string' ? videoDetail.description : '') || videoDescription || '';
    const displayUrl = videoDetail.content_address || videoUrl;

    return (
        <div className="video-page">
            <div ref={topRef}></div>
            <div className="video-main-layout">
                <div className="video-content-area">
                    <div className="video-container">
                        <div className="player-wrapper">
                            <ReactPlayer
                                url={displayUrl}
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
                    onVideoSelect={handleVideoSelect}
                    selectedVideoId={selectedVideo?.id}
                >
                    <CommentArea comments={comments} videoId={selectedVideo?.id} />
                </SidebarTabs>
            </div>
        </div>
    )
}