import React, { useState } from 'react';
import VideoItem from '../VideoItem/VideoItem.jsx';
import './SidebarTabs.css';

export default function SidebarTabs({ videoTitle, videoDescription, videoItems, children, onVideoSelect, selectedVideoId }) {
    const [tab, setTab] = useState('intro');
    return (
        <div className="sidebar-tabs">
            <div className="sidebar-tabs-header">
                <button
                    className={tab === 'intro' ? 'active' : ''}
                    onClick={() => setTab('intro')}
                >简介</button>
                <button
                    className={tab === 'comment' ? 'active' : ''}
                    onClick={() => setTab('comment')}
                >评论</button>
            </div>
            <div className="sidebar-tabs-content">
                {tab === 'intro' ? (
                    <>
                        <div className="sidebar-info">
                            <h1 className="video-title">{videoTitle}</h1>
                            <p className="video-description">{videoDescription}</p>
                        </div>
                        <div className="sidebar-list">
                            {videoItems.map(item => (
                                <VideoItem
                                    key={item.id}
                                    previewImg={item.previewImg}
                                    title={item.title}
                                    onClick={() => onVideoSelect && onVideoSelect(item)}
                                    small
                                    isActive={selectedVideoId === item.id}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="sidebar-comments">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
} 