import React, { useState, useEffect, useRef } from 'react';
import './ArticlesMain.css';
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
                        <img src={assets.Personal_icon} alt="Author" />
                        <span>{article.author}</span>
                    </div>
                    <div className="article-stats">
                        <span className="article-date">{article.date}</span>
                        <span className="article-views">{article.views} views</span>
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
                            <img src={assets.Personal_icon} alt="Author" />
                            <div>
                                <span className="author-name">{article.author}</span>
                                <span className="author-title">{article.authorTitle}</span>
                            </div>
                        </div>
                        <div className="article-stats-full">
                            <span>{article.date}</span>
                            <span>{article.views} views</span>
                            <span>{article.readTime} min read</span>
                        </div>
                    </div>
                    <div className="article-full-content">
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                    <div className="article-actions">
                        <button className="action-btn like-btn">
                            <img src={assets.Like_icon} alt="Like" />
                            <span>{article.likes}</span>
                        </button>
                        <button className="action-btn share-btn">
                            <img src={assets.Share_icon} alt="Share" />
                            <span>Share</span>
                        </button>
                        <button className="action-btn star-btn">
                            <img src={assets.Star_icon} alt="Save" />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Articles() {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const categories = ['All', 'Anxiety', 'Depression', 'Stress Management', 'Interpersonal Relationships', 'Self Growth', 'Sleep Issues', 'Emotional Regulation'];

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

        if (selectedCategory !== 'All') {
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
                        <h1>Mental Health Articles</h1>
                    </div>
                    <p>Professional mental health knowledge to help you better understand and care for yourself</p>
                </div>
            </div>

            <div className="articles-container">
                <div className="articles-sidebar">
                    <div className="search-section">
                        <h3>Search Articles</h3>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search article title, content or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="categories-section">
                        <h3>Article Categories</h3>
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
                        <h3>Statistics</h3>
                        <div className="stats-info">
                            <div className="stat-item">
                                <span className="stat-number">{articles.length}</span>
                                <span className="stat-label">Articles</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{articles.reduce((sum, article) => sum + article.views, 0)}</span>
                                <span className="stat-label">Total Views</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="articles-main">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading articles...</p>
                        </div>
                    ) : (
                        <>
                            <div className="articles-toolbar">
                                <div className="results-info">
                                    Found {filteredArticles.length} articles
                                    {selectedCategory !== 'All' && (
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
                                    <img src={assets.Cloud_icon} alt="No results" />
                                    <h3>No related articles found</h3>
                                    <p>Try adjusting search criteria or selecting other categories</p>
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

export default Articles;