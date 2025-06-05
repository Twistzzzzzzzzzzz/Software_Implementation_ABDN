import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Community.css';
import { assets } from '../../assets/assets';

// 弹幕组件
const DanmuMessage = ({ msg, onEnd }) => {
    const msgRef = useRef(null);
    const [show, setShow] = useState(true);
    

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const element = msgRef.current;
        if (!element) return;

        // 设置随机的垂直位置
        const randomY = Math.random() * 70 + 10; // 10% 到 80% 的位置
        element.style.top = `${randomY}%`;

        // 设置动画持续时间（根据内容长度调整）
        const time = Math.max(8, msg.content.length * 0.3);
        element.style.animationDuration = `${time}s`;

        // 监听动画结束
        const handleEnd = () => {
            setShow(false);
            onEnd(msg.id);
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
                fontSize: msg.fontSize || '16px'
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
    
    // 当前用户信息 - 使用useState确保用户名不会变化
    const [user] = useState(() => ({
        name: 'User' + Math.floor(Math.random() * 1000),
        avatar: assets.Personal_icon,
    }));

    // 预设的弹幕消息
    const defaultMsgs = [
        { username: 'Mental Health Assistant', content: 'Welcome to Mental Health Barrage Wall!', type: 'system' },
        { username: 'Sunshine Youth', content: 'Feeling great today, sharing the joy with everyone!' },
        { username: 'Meditation Master', content: 'Just finished 20 minutes of mindful meditation, feeling very peaceful' },
        { username: 'Anxiety Fighter', content: 'Deep breathing really works, recommend it to friends with anxiety' },
        { username: 'Psychology Lover', content: 'Learning psychology has helped me understand myself better' },
        { username: 'Healing Spirit', content: 'Recording three things I\'m grateful for daily has improved my mindset' },
        { username: 'Stress Manager', content: 'When work stress is high, I listen to light music' },
        { username: 'Emotion Regulator', content: 'When feeling down, exercise is the best medicine' },
        { username: 'Sleep Expert', content: 'Regular sleep schedule is really important, everyone should sleep and wake early' },
        { username: 'Self Growth', content: 'Improving a little each day is the greatest success' },
        { username: 'Soul Guide', content: 'Accepting your imperfections is also a form of growth' },
        { username: 'Positive Energy Spreader', content: 'A smile is the best makeup, everyone should smile more' },
        { username: 'Psychologist', content: 'Listen to your inner voice and find your true self' },
        { username: 'Recovery Journey', content: 'The process of overcoming depression is difficult but worth persisting' },
        { username: 'Light of Hope', content: 'There\'s always a beam of light waiting for us in the darkness' }
    ];

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

    // 初始化弹幕
    useEffect(() => {
        console.log('Starting barrage initialization...'); // 调试用的log
        setLoading(true);
        
        setTimeout(() => {
            // 创建初始弹幕，添加随机延迟
            const initDanmu = defaultMsgs.map((item, index) => {
                // 生成随机ID
                const randomId = Math.random() * 10000;
                return {
                    id: index + 1,
                    username: item.username,
                    content: item.content,
                    type: item.type || 'normal',
                    color: item.type === 'system' ? '#FFD700' : colorArr[Math.floor(Math.random() * colorArr.length)],
                    fontSize: sizeArr[Math.floor(Math.random() * sizeArr.length)],
                    time: Date.now() + index * 2000 // 每2秒发送一条
                };
            });

            setMessageList(initDanmu);
            setLoading(false);
            console.log('Barrage initialization completed!'); // 调试用的log
        }, 1000);
    }, []);

    // 自动发送预设弹幕
    useEffect(() => {
        if (loading) return;
        if (isPaused) return; // 如果暂停了就不发送

        const timer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * defaultMsgs.length);
            const randomMsg = defaultMsgs[randomIndex];
            
            // 生成新的弹幕对象
            const newDanmu = {
                id: Date.now() + Math.random(), // 确保ID唯一
                username: randomMsg.username,
                content: randomMsg.content,
                type: randomMsg.type || 'normal',
                color: randomMsg.type === 'system' ? '#FFD700' : colorArr[Math.floor(Math.random() * colorArr.length)],
                fontSize: sizeArr[Math.floor(Math.random() * sizeArr.length)],
                time: Date.now()
            };

            setMessageList(prev => {
                // 限制弹幕数量，避免内存泄漏
                const newList = [...prev, newDanmu];
                if (newList.length > MAX_MESSAGES) {
                    return newList.slice(-MAX_MESSAGES);
                }
                return newList;
            });
        }, AUTO_SEND_INTERVAL + Math.random() * 2000); // 3-5秒随机间隔

        return () => {
            clearInterval(timer);
        };
    }, [loading, isPaused]);

    // 清理已完成动画的弹幕
    const handleMsgEnd = useCallback((msgId) => {
        setMessageList(prev => prev.filter(item => item.id !== msgId));
    }, []);

    // 发送弹幕
    const sendMsg = () => {
        if (!inputText.trim()) {
            alert('Please enter the barrage content!'); // 简单的提示
            return;
        }

        // 创建新弹幕
        const newDanmu = {
            id: Date.now() + Math.random(),
            username: user.name,
            content: inputText.trim(),
            type: 'user',
            color: colorArr[Math.floor(Math.random() * colorArr.length)],
            fontSize: sizeArr[Math.floor(Math.random() * sizeArr.length)],
            time: Date.now()
        };

        console.log('Send barrage:', newDanmu); // 调试用
        setMessageList(prev => [...prev, newDanmu]);
        setInputText('');
        
        // 聚焦回输入框
        if (inputRef.current) {
            inputRef.current.focus();
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
        const confirmClear = window.confirm('Are you sure you want to clear all barrages?');
        if (confirmClear) {
            setMessageList([]);
            console.log('All barrages cleared');
        }
    };
    
    // 暂停/恢复弹幕
    const togglePause = () => {
        setIsPaused(!isPaused);
        console.log(isPaused ? 'Resume barrages' : 'Pause barrages');
    };

    // 加载状态
    if (loading) {
        return (
            <div className="danmu-container">
                <div className="danmu-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading barrage wall...</p>
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
                    <h1>Mental Health Barrage Wall</h1>
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
                            <span className="stat-label">Current Barrages</span>
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
                    <div className="user-info">
                        <img src={user.avatar} alt="Avatar" className="user-avatar" />
                        <span className="username">{user.name}</span>
                    </div>
                    
                    <div className="input-box">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyDown}
                            placeholder="Enter your mood barrage, press Enter to send..."
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
