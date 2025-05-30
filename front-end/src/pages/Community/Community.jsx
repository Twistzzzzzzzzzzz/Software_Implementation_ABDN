import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Community.css';
import { assets } from '../../assets/assets';

// 弹幕组件
const DanmuMessage = ({ msg, onEnd }) => {
    const msgRef = useRef(null);
    const [show, setShow] = useState(true);
    
    // 这个变量其实没用到，但是先留着吧
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
    const [msgId, setMsgId] = useState(1000); // 这个变量好像也没用到
    const inputRef = useRef(null);
    const danmuBoxRef = useRef(null);
    
    // 一些可能用得到的状态
    const [isPaused, setIsPaused] = useState(false);
    const [showStats, setShowStats] = useState(true);
    
    // 当前用户信息 - 使用useState确保用户名不会变化
    const [user] = useState(() => ({
        name: '用户' + Math.floor(Math.random() * 1000),
        avatar: assets.Personal_icon,
    }));

    // 预设的弹幕消息
    const defaultMsgs = [
        { username: '心理小助手', content: '欢迎来到心理健康弹幕墙！', type: 'system' },
        { username: '阳光少年', content: '今天心情特别好，分享给大家！' },
        { username: '冥想达人', content: '刚刚完成了20分钟的正念冥想，感觉很平静' },
        { username: '焦虑克星', content: '深呼吸真的很有用，推荐给有焦虑的朋友' },
        { username: '心理学爱好者', content: '学习心理学让我更了解自己了' },
        { username: '治愈系', content: '每天记录三件感恩的事，心态变好了很多' },
        { username: '压力管理师', content: '工作压力大的时候，我会听听轻音乐' },
        { username: '情绪调节员', content: '情绪低落时，运动是最好的良药' },
        { username: '睡眠专家', content: '规律作息真的很重要，大家要早睡早起' },
        { username: '自我成长', content: '每天进步一点点，就是最大的成功' },
        { username: '心灵导师', content: '接纳自己的不完美，也是一种成长' },
        { username: '正能量传播者', content: '微笑是最好的化妆品，大家要多笑笑' },
        { username: '心理咨询师', content: '倾听自己内心的声音，找到真正的自己' },
        { username: '康复之路', content: '走出抑郁的过程虽然艰难，但值得坚持' },
        { username: '希望之光', content: '黑暗中总有一束光在等着我们' }
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
        console.log('开始初始化弹幕...'); // 调试用的log
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
            console.log('弹幕初始化完成！'); // 调试用的log
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
            alert('请输入弹幕内容！'); // 简单的提示
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

        console.log('发送弹幕:', newDanmu); // 调试用
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
        const confirmClear = window.confirm('确定要清空所有弹幕吗？');
        if (confirmClear) {
            setMessageList([]);
            console.log('已清空所有弹幕');
        }
    };
    
    // 暂停/恢复弹幕
    const togglePause = () => {
        setIsPaused(!isPaused);
        console.log(isPaused ? '恢复弹幕' : '暂停弹幕');
    };

    // 加载状态
    if (loading) {
        return (
            <div className="danmu-container">
                <div className="danmu-loading">
                    <div className="loading-spinner"></div>
                    <p>弹幕墙加载中...</p>
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
                    <h1>心理健康弹幕墙</h1>
                    <p>分享你的心情，传递正能量</p>
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
                            <span className="stat-label">当前弹幕</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">∞</span>
                            <span className="stat-label">在线用户</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 输入区域 */}
            <div className="danmu-input-area">
                <div className="input-container">
                    <div className="user-info">
                        <img src={user.avatar} alt="头像" className="user-avatar" />
                        <span className="username">{user.name}</span>
                    </div>
                    
                    <div className="input-box">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyDown}
                            placeholder="输入你的心情弹幕，按回车发送..."
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
                                发送
                            </button>
                        </div>
                    </div>
                </div>

                <div className="control-buttons">
                    <button onClick={clearAll} className="control-btn clear-btn">
                        清空弹幕
                    </button>
                    {/*<button onClick={togglePause} className="control-btn pause-btn">
                        {isPaused ? '恢复' : '暂停'}
                    </button>*/}
                    <button 
                        onClick={() => setShowStats(!showStats)} 
                        className="control-btn settings-btn"
                    >
                        {showStats ? '隐藏统计' : '显示统计'}
                    </button>
                </div>
            </div>
        </div>
    );
}
