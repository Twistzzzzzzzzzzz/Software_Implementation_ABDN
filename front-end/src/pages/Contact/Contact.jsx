import React, { useState, useEffect, useRef } from 'react';
import './Contact.css';
import { assets } from '../../assets/assets';
import mockArticle  from './article.js';
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

// 文章卡片组件
const ArticleCard = ({ article, onClick }) => {
    return (
        <div className="article-card" onClick={() => onClick(article)}>
            <div className="article-image">
                <LazyLoadImage 
                    src={article.image} 
                    alt={article.title} 
                    className="article-img"
                />
                <div className="article-category">{article.category}</div>
            </div>
            <div className="article-content">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                <div className="article-meta">
                    <div className="article-author">
                        <img src={assets.Personal_icon} alt="作者" />
                        <span>{article.author}</span>
                    </div>
                    <div className="article-stats">
                        <span className="article-date">{article.date}</span>
                        <span className="article-views">{article.views} 阅读</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 文章详情模态框
const ArticleModal = ({ article, isOpen, onClose }) => {
    if (!isOpen || !article) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{article.title}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="article-full-image">
                        <img src={article.image} alt={article.title} />
                    </div>
                    <div className="article-meta-full">
                        <div className="article-author-full">
                            <img src={assets.Personal_icon} alt="作者" />
                            <div>
                                <span className="author-name">{article.author}</span>
                                <span className="author-title">{article.authorTitle}</span>
                            </div>
                        </div>
                        <div className="article-stats-full">
                            <span>{article.date}</span>
                            <span>{article.views} 阅读</span>
                            <span>{article.readTime} 分钟阅读</span>
                        </div>
                    </div>
                    <div className="article-full-content">
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                    <div className="article-actions">
                        <button className="action-btn like-btn">
                            <img src={assets.Like_icon} alt="点赞" />
                            <span>{article.likes}</span>
                        </button>
                        <button className="action-btn share-btn">
                            <img src={assets.Share_icon} alt="分享" />
                            <span>分享</span>
                        </button>
                        <button className="action-btn star-btn">
                            <img src={assets.Star_icon} alt="收藏" />
                            <span>收藏</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Contact() {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const categories = ['全部', '焦虑症', '抑郁症', '压力管理', '人际关系', '自我成长', '睡眠问题', '情绪调节'];

    // 模拟文章数据
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setArticles(mockArticle);
            setFilteredArticles(mockArticle);
            setIsLoading(false);
        }, 1000);
    }, []);

    // 搜索和筛选功能
    useEffect(() => {
        let filtered = articles;

        if (selectedCategory !== '全部') {
            filtered = filtered.filter(article => article.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(article => 
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredArticles(filtered);
    }, [articles, selectedCategory, searchTerm]);

    const handleArticleClick = (article) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArticle(null);
    };

    return (
        <div className="articles-page">
            <div className="articles-header">
                <div className="header-content">
                    <div className="header-title">
                        <img src={assets.Cloud_icon} alt="文章图标" />
                        <h1>心理健康文章</h1>
                    </div>
                    <p>专业的心理健康知识，助您更好地了解和关爱自己</p>
                </div>
            </div>

            <div className="articles-container">
                <div className="articles-sidebar">
                    <div className="search-section">
                        <h3>搜索文章</h3>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="搜索文章标题、内容或作者..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="categories-section">
                        <h3>文章分类</h3>
                        <div className="categories-list">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="stats-section">
                        <h3>统计信息</h3>
                        <div className="stats-info">
                            <div className="stat-item">
                                <span className="stat-number">{articles.length}</span>
                                <span className="stat-label">篇文章</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{articles.reduce((sum, article) => sum + article.views, 0)}</span>
                                <span className="stat-label">总阅读量</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="articles-main">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>加载文章中...</p>
                        </div>
                    ) : (
                        <>
                            <div className="articles-toolbar">
                                <div className="results-info">
                                    找到 {filteredArticles.length} 篇文章
                                    {selectedCategory !== '全部' && (
                                        <span className="category-filter">
                                            - {selectedCategory}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="articles-grid">
                                {filteredArticles.map(article => (
                                    <ArticleCard
                                        key={article.id}
                                        article={article}
                                        onClick={handleArticleClick}
                                    />
                                ))}
                            </div>

                            {filteredArticles.length === 0 && (
                                <div className="no-results">
                                    <img src={assets.Cloud_icon} alt="无结果" />
                                    <h3>没有找到相关文章</h3>
                                    <p>尝试调整搜索条件或选择其他分类</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <ArticleModal
                article={selectedArticle}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default Contact;