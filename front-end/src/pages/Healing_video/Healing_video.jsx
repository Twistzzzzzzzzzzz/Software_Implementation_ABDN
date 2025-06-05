import ReactPlayer from 'react-player'
import { assets } from '../../assets/assets'
import './Healing_vedio.css'
import CommentArea from "./components/CommentArea/CommentArea.jsx";
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VideoItem from './components/VideoItem/VideoItem.jsx';
import SidebarTabs from './components/SidebarTabs/SidebarTabs.jsx';
import request from '../../utils/request';

export default function Healing_video({ videoTitle, videoDescription }) {
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVideos() {
            setLoading(true);
            try {
                const res = await request.get('/api/v1/resources/video', { params: { size: 10, page: 1 } });
                const data = res.data;
                let itemsWithImg = [];
                if (data && data.items && Array.isArray(data.items)) {
                    itemsWithImg = data.items.map((item) => ({
                        id: item.video_id,
                        title: item.title,
                        previewImg: item.pictrue_address,
                    }));
                }
                // 检查是否有location.state.videoId
                if (location.state && location.state.videoId) {
                    const vid = location.state.videoId;
                    // 请求该视频详情
                    const detailRes = await request.get(`/api/v1/resources/video/${vid}`);
                    const detailData = detailRes.data;
                    // 加入视频列表最后
                    itemsWithImg.push({
                        id: detailData.video_id,
                        title: detailData.title,
                        previewImg: detailData.pictrue_address || detailData.content_address,
                    });
                    setVideoItems(itemsWithImg);
                    setSelectedVideo({
                        id: detailData.video_id,
                        title: detailData.title,
                        previewImg: detailData.pictrue_address || detailData.content_address,
                    });
                } else {
                    setVideoItems(itemsWithImg);
                    if (itemsWithImg.length > 0) {
                        setSelectedVideo(itemsWithImg[0]);
                    }
                }
            } catch (e) {
                setVideoItems([]);
            } finally {
                setLoading(false);
            }
        }
        fetchVideos();
    }, [location.state]);

    // 获取选中视频详情和评论
    useEffect(() => {
        async function fetchVideoDetail() {
            if (!selectedVideo) return;
            try {
                const res = await request.get(`/api/v1/resources/video/${selectedVideo.id}`);
                const data = res.data;
                if (data) {
                    setVideoDetail(data);
                    setComments(data.comment || []);
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
    const displayUrl = videoDetail.content_address || '';

    return (
        <div className="video-page">
            <div ref={topRef}></div>
            <div className="video-main-layout">
                <div className="video-content-area">
                    <div className="video-container">
                        <div className="player-wrapper">
                            {loading || !videoDetail.content_address ? (
                                <div style={{textAlign: 'center', padding: '40px 0', fontSize: '18px'}}>正在加载视频...</div>
                            ) : (
                                <ReactPlayer
                                    url={videoDetail.content_address}
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                    className="react-player"
                                />
                            )}
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