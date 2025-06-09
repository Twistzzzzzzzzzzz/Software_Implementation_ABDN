import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Community.css';
import { assets } from '../../assets/assets';
import request from '../../utils/request';

// 弹幕组件
const DanmuMessage = ({ msg, onEnd }) => {
    const msgRef = useRef(null);
    const [show, setShow] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const element = msgRef.current;
        if (!element) return;

        // 使用分配的轨道位置
        if (msg.yPosition !== undefined) {
            element.style.top = `${msg.yPosition}px`;
        } else {
            // 备用方案：随机位置
            const randomY = Math.random() * 70 + 10;
            element.style.top = `${randomY}%`;
        }

        // 使用分配的速度
        const animationDuration = msg.speed || Math.max(6, msg.content.length * 0.3);
        element.style.animationDuration = `${animationDuration}s`;

        // 监听动画结束
        const handleEnd = () => {
            setShow(false);
            onEnd(msg.id, msg.trackIndex);
        };

        element.addEventListener('animationend', handleEnd);

        return () => {
            element.removeEventListener('animationend', handleEnd);
        };
    }, [msg, onEnd]);

    if (!show) return null;

    return (
        <div 
            ref={msgRef}
            className={`danmu-message ${msg.type || 'normal'}`}
            style={{
                color: msg.color || '#ffffff',
                fontSize: msg.fontSize || '16px',
                // 鼠标悬停时暂停动画
                animationPlayState: isHovered ? 'paused' : 'running'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="danmu-username">{msg.username}:</span>
            <span className="danmu-content">{msg.content}</span>
        </div>
    );
};

export default function Community() {
    const [messageList, setMessageList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
   
    const inputRef = useRef(null);
    const danmuBoxRef = useRef(null);

    const [isPaused, setIsPaused] = useState(false);
    const [showStats, setShowStats] = useState(true);
    
    // 弹幕轨道管理
    const trackManagerRef = useRef({
        tracks: [], // 存储每个轨道的状态
        trackCount: 8, // 总轨道数
        trackHeight: 50, // 每个轨道的高度
    });
    
    // 当前用户信息 - 使用useState确保用户名不会变化
    const [user] = useState(() => ({
        name: 'User' + Math.floor(Math.random() * 1000),
        avatar: assets.Personal_icon,
    }));


    // 随机颜色数组
    const colorArr = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];

    // 随机字体大小
    const sizeArr = ['14px', '16px', '18px', '20px'];
    
    // 一些常量
    const MAX_MESSAGES = 50; // 最大弹幕数量
    const AUTO_SEND_INTERVAL = 3000; // 自动发送间隔

    // 轨道管理函数
    const allocateTrack = useCallback(() => {
        const manager = trackManagerRef.current;
        const currentTime = Date.now();
        
        // 初始化轨道如果还没有
        if (manager.tracks.length === 0) {
            manager.tracks = Array(manager.trackCount).fill(null).map(() => ({
                occupied: false,
                lastUsed: 0
            }));
        }
        
        // 找到空闲的轨道
        for (let i = 0; i < manager.trackCount; i++) {
            const track = manager.tracks[i];
            // 如果轨道未被占用，或者已经空闲超过2秒
            if (!track.occupied || (currentTime - track.lastUsed) > 2000) {
                track.occupied = true;
                track.lastUsed = currentTime;
                return {
                    trackIndex: i,
                    yPosition: (i * manager.trackHeight) + 10 // 10px偏移
                };
            }
        }
        
        // 如果所有轨道都被占用，使用随机轨道
        const randomTrack = Math.floor(Math.random() * manager.trackCount);
        manager.tracks[randomTrack].occupied = true;
        manager.tracks[randomTrack].lastUsed = currentTime;
        return {
            trackIndex: randomTrack,
            yPosition: (randomTrack * manager.trackHeight) + 10
        };
    }, []);

    const releaseTrack = useCallback((trackIndex) => {
        const manager = trackManagerRef.current;
        if (manager.tracks[trackIndex]) {
            manager.tracks[trackIndex].occupied = false;
        }
    }, []);

    // 获取评论列表
    const fetchComments = async (isInitialLoad = false) => {
        if (isInitialLoad) {
            setLoading(true);
        }
        
        try {
            const response = await request.get('/api/v1/resources/community/info');
            
            if (response && response.code === 0 && response.data) {
                // 将评论数据转换为弹幕格式
                const commentsAsDanmu = response.data.map((comment, index) => {
                    const track = allocateTrack();
                    const contentLength = comment.content?.length || 10;
                    
                    return {
                        id: comment.comment_id || Date.now() + index,
                        username: comment.user_name || 'Anonymous',
                        content: comment.content || comment.text || '',
                        type: 'normal',
                        color: colorArr[Math.floor(Math.random() * colorArr.length)],
                        fontSize: sizeArr[Math.floor(Math.random() * sizeArr.length)],
                        time: new Date(comment.created_at || Date.now()).getTime(),
                        trackIndex: track.trackIndex,
                        yPosition: track.yPosition,
                        // 根据内容长度和随机因子计算速度
                        speed: Math.max(6, Math.min(15, 8 + contentLength * 0.2 + Math.random() * 4))
                    };
                });
                
                // 对于定期刷新，将新评论添加到现有列表而不是替换
                if (isInitialLoad) {
                    setMessageList(commentsAsDanmu);
                } else {
                    // 定期刷新时，添加新的评论到现有弹幕中
                    setMessageList(prev => {
                        const newComments = commentsAsDanmu.filter(newComment => 
                            !prev.some(existingComment => existingComment.id === newComment.id)
                        );
                        const combinedList = [...prev, ...newComments];
                        // 限制总数量，避免内存泄漏
                        return combinedList.length > MAX_MESSAGES ? 
                            combinedList.slice(-MAX_MESSAGES) : combinedList;
                    });
                }
                
                console.log('Comments loaded from API:', commentsAsDanmu.length);
            } else if (isInitialLoad) {
                // 只有初始加载时才设置空列表
                console.log('API failed, no comments available');
                setMessageList([]);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            if (isInitialLoad) {
                // 只有初始加载时才设置空列表
                setMessageList([]);
            }
        } finally {
            if (isInitialLoad) {
                setLoading(false);
            }
        }
    };

    // 初始化评论
    useEffect(() => {
        console.log('Starting comment initialization...'); 
        fetchComments(true); // 初始加载标记为true
    }, []);

    // 定期从后端重新获取评论数据，实现持续弹幕滚动
    useEffect(() => {
        if (loading || isPaused) return;

        const timer = setInterval(() => {
            // 定期重新获取评论数据
            console.log('Refreshing comments from backend...');
            fetchComments();
        }, AUTO_SEND_INTERVAL + Math.random() * 2000); // 3-5秒随机间隔重新获取

        return () => {
            clearInterval(timer);
        };
    }, [loading, isPaused]);

    // 清理已完成动画的弹幕
    const handleMsgEnd = useCallback((msgId, trackIndex) => {
        setMessageList(prev => prev.filter(item => item.id !== msgId));
        // 释放轨道
        if (trackIndex !== undefined) {
            releaseTrack(trackIndex);
        }
    }, [releaseTrack]);

    // 发送弹幕 - 修改为调用API
    const sendMsg = async () => {
        if (!inputText.trim()) {
            alert('Please enter the bullet comment content!'); 
            return;
        }

        try {
            // 获取token 
            const token = localStorage.getItem('access_token');
            
            // 构建评论对象
            const commentData = {
                content: inputText.trim(),
            };

            // 调用后端API创建评论 (request拦截器会自动添加Authorization header)
            const response = await request.post('/api/v1/resources/community', commentData);

            if (response && response.code === 0 && response.data) {
                // API调用成功，创建新弹幕显示
                const track = allocateTrack();
                const content = response.data.content || inputText.trim();
                const newDanmu = {
                    id: response.data.comment_id || Date.now() + Math.random(),
                    username: response.data.user_name || user.name,
                    content: content,
                    type: 'user',
                    color: colorArr[Math.floor(Math.random() * colorArr.length)],
                    fontSize: sizeArr[Math.floor(Math.random() * sizeArr.length)],
                    time: Date.now(),
                    trackIndex: track.trackIndex,
                    yPosition: track.yPosition,
                    speed: Math.max(6, Math.min(15, 8 + content.length * 0.2 + Math.random() * 4))
                };

                console.log('Comment created successfully:', newDanmu);
                setMessageList(prev => [...prev, newDanmu]);
                setInputText('');
                
                // 聚焦回输入框
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            } else {
                console.error('Failed to create comment:', response);
                alert('Failed to send comment, please try again');
            }
        } catch (error) {
            console.error('Error sending comment:', error);
            
            // 如果API调用失败，仍然在本地显示弹幕（可选）
            const track = allocateTrack();
            const content = inputText.trim();
            const newDanmu = {
                id: Date.now() + Math.random(),
                username: user.name,
                content: content,
                type: 'user',
                color: colorArr[Math.floor(Math.random() * colorArr.length)],
                fontSize: sizeArr[Math.floor(Math.random() * sizeArr.length)],
                time: Date.now(),
                trackIndex: track.trackIndex,
                yPosition: track.yPosition,
                speed: Math.max(6, Math.min(15, 8 + content.length * 0.2 + Math.random() * 4))
            };

            console.log('API failed, showing local comment:', newDanmu);
            setMessageList(prev => [...prev, newDanmu]);
            setInputText('');
            
            if (inputRef.current) {
                inputRef.current.focus();
            }
            
            alert('Network error, comment displayed locally only');
        }
    };

    // 处理键盘事件
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMsg();
        }
        // 也可以用Ctrl+Enter发送
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            sendMsg();
        }
    };

    // 清空所有弹幕
    const clearAll = () => {
        const confirmClear = window.confirm('Are you sure you want to clear all bullet comments?');
        if (confirmClear) {
            setMessageList([]);
            // 释放所有轨道
            const manager = trackManagerRef.current;
            if (manager.tracks.length > 0) {
                manager.tracks.forEach(track => {
                    track.occupied = false;
                    track.lastUsed = 0;
                });
            }
            console.log('All bullet comments cleared');
        }
    };
    
    // 暂停/恢复弹幕
    const togglePause = () => {
        setIsPaused(!isPaused);
        console.log(isPaused ? 'Resume bullet comments' : 'Pause bullet comments');
    };

    // 加载状态
    if (loading) {
        return (
            <div className="danmu-container">
                <div className="danmu-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading bullet comment wall...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="danmu-container">
            {/* 弹幕显示区域 */}
            <div className="danmu-screen" ref={danmuBoxRef}>
                <div className="danmu-background">
                    <div className="background-pattern"></div>
                </div>
                
                {/* 标题区域 */}
                <div className="danmu-header">
                    <h1>Mental Health Bullet Comment Wall</h1>
                    <p>Share your mood, spread positive energy</p>
                </div>

                {/* 弹幕消息 */}
                <div className="danmu-messages">
                    {messageList.map(msg => (
                        <DanmuMessage
                            key={msg.id}
                            msg={msg}
                            onEnd={handleMsgEnd}
                        />
                    ))}
                </div>

                {/* 统计信息 */}
                {showStats && (
                    <div className="danmu-stats">
                        <div className="stat-item">
                            <span className="stat-number">{messageList.length}</span>
                            <span className="stat-label">Current Bullet Comments</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">∞</span>
                            <span className="stat-label">Online Users</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 输入区域 */}
            <div className="danmu-input-area">
                <div className="input-container">
                    
                    <div className="input-box">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyDown}
                            placeholder="Enter your mood bullet comment, press Enter to send..."
                            maxLength={50}
                            className="message-input"
                        />
                        <div className="input-actions">
                            <span className="char-count">{inputText.length}/50</span>
                            <button 
                                onClick={sendMsg}
                                disabled={!inputText.trim()}
                                className="send-btn"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                <div className="control-buttons">
                    <button onClick={clearAll} className="control-btn clear-btn">
                        Clear All
                    </button>
                    {/*<button onClick={togglePause} className="control-btn pause-btn">
                        {isPaused ? '恢复' : '暂停'}
                    </button>*/}
                    <button 
                        onClick={() => setShowStats(!showStats)} 
                        className="control-btn settings-btn"
                    >
                        {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                </div>
            </div>
        </div>
    );
}
