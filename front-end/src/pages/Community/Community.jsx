import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Community.css';
import { assets } from '../../assets/assets';

// 防抖函数
function useDebounce(fn, delay) {
    const timer = useRef(null);
    
    return function(...args) {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        
        timer.current = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

// 图片懒加载组件
const LazyLoadImage = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(imgRef.current);
                }
            },
            { rootMargin: '100px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <div ref={imgRef} className={`${className}-container`}>
            {isInView && (
                <img 
                    src={src} 
                    alt={alt} 
                    className={`${className} ${isLoaded ? 'loaded' : ''}`}
                    onLoad={() => setIsLoaded(true)}
                    style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
                />
            )}
            {(!isInView || !isLoaded) && (
                <div className="image-placeholder"></div>
            )}
        </div>
    );
};

export default function Community() {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef(null);
    const postsContainerRef = useRef(null);
    
    // 虚拟列表优化
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    
    // Dummy user data - in a real app, this would come from auth context
    const currentUser = {
        username: 'user123',
        profilePic: assets.Personal_icon,
    };
    
    // 防抖处理文本输入
    const debouncedSetContent = useDebounce((value) => {
        setNewPostContent(value);
    }, 300);
    
    const handleContentChange = (e) => {
        // 立即更新UI显示，但防抖实际状态更新
        e.persist();
        debouncedSetContent(e.target.value);
    };
    
    // 防抖图片处理
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // 检查文件大小 (限制为5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }
        
        // 检查文件类型
        if (!file.type.match('image.*')) {
            alert('只能上传图片文件');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }
        
        setPostImage(file);
        
        // 使用防抖处理图片预览
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    
    // 检测滚动加载更多内容
    const handleScroll = useCallback(() => {
        if (!postsContainerRef.current) return;
        
        setScrollPosition(postsContainerRef.current.scrollTop);
        
        // 检测是否滚动到底部，可以在这里实现加载更多功能
        const { scrollTop, scrollHeight, clientHeight } = postsContainerRef.current;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            // 可以在这里加载更多帖子
            console.log('接近底部，可以加载更多内容');
        }
    }, []);
    
    // 使用节流优化滚动事件
    const throttleScroll = useCallback(() => {
        let isScrolling = false;
        
        return () => {
            if (!isScrolling) {
                isScrolling = true;
                
                window.requestAnimationFrame(() => {
                    handleScroll();
                    isScrolling = false;
                });
            }
        };
    }, [handleScroll]);
    
    // 监听滚动事件
    useEffect(() => {
        const scrollHandler = throttleScroll();
        const container = document.querySelector('.community-container');
        
        if (container) {
            container.addEventListener('scroll', scrollHandler);
        }
        
        return () => {
            if (container) {
                container.removeEventListener('scroll', scrollHandler);
            }
        };
    }, [throttleScroll]);
    
    // Dummy initial posts
    useEffect(() => {
        // 模拟API加载延迟
        setIsLoading(true);
        
        setTimeout(() => {
            const initialPosts = [
                {
                    id: 1,
                    username: 'anxiety_helper',
                    profilePic: assets.Personal_icon,
                    content: '今天学习了一些应对焦虑的新方法，分享给大家：1. 深呼吸练习 2. 正念冥想 3. 认知重构。希望对大家有帮助！',
                    image: assets.Test_answer_bg,
                    likes: 24,
                    comments: 5,
                    timestamp: '2小时前'
                },
                {
                    id: 2,
                    username: 'mental_health_advocate',
                    profilePic: assets.Personal_icon,
                    content: '记住自我关爱的重要性。有时我们需要暂停，关注自己的感受和需求。',
                    image: null,
                    likes: 42,
                    comments: 7,
                    timestamp: '4小时前'
                },
                {
                    id: 3,
                    username: 'mindfulness_coach',
                    profilePic: assets.Personal_icon,
                    content: '正念冥想可以帮助我们更好地理解自己的情绪。今天试着花5分钟专注于呼吸，观察自己的想法而不评判它们。',
                    image: assets.Test_answer_bg,
                    likes: 36,
                    comments: 8,
                    timestamp: '6小时前'
                },
                {
                    id: 4,
                    username: 'psychology_student',
                    profilePic: assets.Personal_icon,
                    content: '今天在课上学习了关于创伤后成长的理论。我们经历的困难有时也能带来意想不到的积极变化，使我们更加坚强和有韧性。',
                    image: null,
                    likes: 19,
                    comments: 4,
                    timestamp: '昨天'
                },
                {
                    id: 5,
                    username: 'wellness_journey',
                    profilePic: assets.Personal_icon,
                    content: '分享一个小技巧：当感到压力大时，试着写下三件你感恩的事情。这个简单的习惯可以帮助我们培养积极的心态。',
                    image: null,
                    likes: 51,
                    comments: 12,
                    timestamp: '2天前'
                }
            ];
            
            setPosts(initialPosts);
            setVisiblePosts(initialPosts);
            setIsLoading(false);
        }, 1000);
    }, []);
    
    const triggerImageUpload = () => {
        fileInputRef.current.click();
    };
    
    const removeImage = () => {
        setPostImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    // 防抖处理发帖
    const debouncedCreatePost = useDebounce(() => {
        if (newPostContent.trim() === '' && !postImage) return;
        
        const newPost = {
            id: Date.now(),
            username: currentUser.username,
            profilePic: currentUser.profilePic,
            content: newPostContent,
            image: imagePreview,
            likes: 0,
            comments: 0,
            timestamp: '刚刚'
        };
        
        // 优化状态更新，避免重渲染整个列表
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setVisiblePosts(prevPosts => [newPost, ...prevPosts]);
        
        // 清空表单
        setNewPostContent('');
        setPostImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, 300);
    
    const createPost = () => {
        debouncedCreatePost();
    };
    
    // 加载状态
    if (isLoading) {
        return (
            <div className="community-container">
                <div className="community-loading">
                    <div className="loading-spinner"></div>
                    <p>加载中...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="community-container" ref={postsContainerRef}>
            <div className="community-header">
                <h1>心理社区</h1>
                <p>与他人分享你的想法、经验和支持</p>
            </div>
            
            <div className="post-creation-card">
                <div className="post-header">
                    <img src={currentUser.profilePic} alt="Profile" className="profile-pic" />
                    <span className="username">{currentUser.username}</span>
                </div>
                
                <textarea 
                    className="post-textarea"
                    placeholder="分享你的心理健康经验或想法..."
                    defaultValue={newPostContent}
                    onChange={handleContentChange}
                ></textarea>
                
                {imagePreview && (
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                        <button className="remove-image-btn" onClick={removeImage}>✕</button>
                    </div>
                )}
                
                <div className="post-actions">
                    <div className="post-options">
                        <button className="post-option-btn" onClick={triggerImageUpload}>
                            <span role="img" aria-label="image">🖼️</span> 添加图片
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <button 
                        className={`post-btn ${(!newPostContent.trim() && !postImage) ? 'disabled' : ''}`}
                        onClick={createPost}
                        disabled={!newPostContent.trim() && !postImage}
                    >
                        发布
                    </button>
                </div>
            </div>
            
            <div className="posts-container">
                {visiblePosts.map(post => (
                    <div className="post-card" key={post.id}>
                        <div className="post-header">
                            <img src={post.profilePic} alt="Profile" className="profile-pic" />
                            <div className="post-info">
                                <span className="username">{post.username}</span>
                                <span className="timestamp">{post.timestamp}</span>
                            </div>
                        </div>
                        
                        <p className="post-content">{post.content}</p>
                        
                        {post.image && (
                            <div className="post-image-container">
                                <LazyLoadImage 
                                    src={post.image} 
                                    alt="Post" 
                                    className="post-image" 
                                />
                            </div>
                        )}
                        
                        <div className="post-stats">
                            <div className="post-stat">
                                <span role="img" aria-label="heart">❤️</span> {post.likes} 喜欢
                            </div>
                            <div className="post-stat">
                                <span role="img" aria-label="comment">💬</span> {post.comments} 评论
                            </div>
                        </div>
                        
                        <div className="post-actions-bottom">
                            <button className="post-action-btn">
                                <span role="img" aria-label="like">👍</span> 喜欢
                            </button>
                            <button className="post-action-btn">
                                <span role="img" aria-label="comment">💬</span> 评论
                            </button>
                            <button className="post-action-btn">
                                <span role="img" aria-label="share">🔄</span> 分享
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
