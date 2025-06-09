import React, { useState, useEffect, useRef } from 'react';
import './ArticlesMain.css';
import { assets } from '../../assets/assets';
import request from '../../utils/request';

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
                    src={article.image || 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                    alt={article.title}
                    className="article-img"
                />
                <div className="article-category">{article.category || 'General'}</div>
            </div>
            <div className="article-content">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">{article.summary || article.excerpt}</p>
                <div className="article-meta">
                    <div className="article-author">
                        <img src={assets.Personal_icon} alt="Author" />
                        <span>{article.author || 'Unknown Author'}</span>
                    </div>
                    <div className="article-stats">
                        <span className="article-date">{article.published_at || article.date}</span>
                        <span className="article-views">{article.views || 0} views</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 文章详情模态框
const ArticleModal = ({ article, articleDetail, isOpen, onClose }) => {
    if (!isOpen || !article) return null;

    const displayArticle = articleDetail || article;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{displayArticle.title}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="article-full-image">
                        <img src={displayArticle.image || 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} alt={displayArticle.title} />
                    </div>
                    <div className="article-meta-full">
                        <div className="article-author-full">
                            <img src={assets.Personal_icon} alt="Author" />
                            <div>
                                <span className="author-name">{displayArticle.author || 'Unknown Author'}</span>
                                <span className="author-title">{displayArticle.authorTitle || ''}</span>
                            </div>
                        </div>
                        <div className="article-stats-full">
                            <span>{displayArticle.published_at || displayArticle.date}</span>
                            <span>{displayArticle.views || 0} views</span>
                            <span>{displayArticle.readTime || 5} min read</span>
                        </div>
                    </div>
                    <div className="article-full-content">
                        {displayArticle.content_address ? (
                            <div>Loading content...</div>
                        ) : displayArticle.content ? (
                            displayArticle.content.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))
                        ) : (
                            <p>No content available</p>
                        )}
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
    const [articleDetail, setArticleDetail] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalArticles, setTotalArticles] = useState(0);

    const categories = ['All', 'Anxiety', 'Depression', 'Stress Management', 'Relationships', 'Self Growth', 'Sleep Issues', 'Emotional Regulation'];

    // 获取文章列表
    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const response = await request.get('/api/v1/resources/articles', {
                    params: { 
                        size: 20, 
                        page: currentPage 
                    }
                });

                if (response && response.code === 0 && response.data) {
                    const articleData = response.data;
                    setArticles(articleData.items || []);
                    setTotalArticles(articleData.total || 0);
                } else {
                    setArticles([]);
                    setTotalArticles(0);
                }
            } catch (error) {
                console.error('Failed to fetch articles:', error);
                setArticles([]);
                setTotalArticles(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [currentPage]);

    // 搜索和筛选功能
    useEffect(() => {
        let filtered = articles;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(article => 
                article.category === selectedCategory || 
                (article.summary && article.summary.toLowerCase().includes(selectedCategory.toLowerCase()))
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredArticles(filtered);
    }, [articles, selectedCategory, searchTerm]);

    const handleArticleClick = async (article) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
        setArticleDetail(null);

        // 获取文章详情
        try {
            const response = await request.get(`/api/v1/resources/articles/${article.article_id}`);
            if (response && response.code === 0 && response.data) {
                setArticleDetail(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch article detail:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArticle(null);
        setArticleDetail(null);
    };

    return (
        <div className="articles-page">
            <div className="articles-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>Mental Health Articles</h1>
                    </div>
                    <p>Specialized mental health knowledge to help you better understand and care for yourself</p>
                </div>
            </div>

            <div className="articles-container">
                <div className="articles-sidebar">
                    <div className="search-section">
                        <h3>Search Articles</h3>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Enter title, content or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="categories-section">
                        <h3>Article Filter</h3>
                        <div className="categories-list">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category === 'All' ? 'All' :
                                     category === 'Anxiety' ? 'Anxiety' :
                                     category === 'Depression' ? 'Depression' :
                                     category === 'Stress Management' ? 'Stress Management' :
                                     category === 'Relationships' ? 'Relationships' :
                                     category === 'Self Growth' ? 'Self Growth' :
                                     category === 'Sleep Issues' ? 'Sleep Issues' :
                                     category === 'Emotional Regulation' ? 'Emotional Regulation' : category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="stats-section">
                        <h3>Statistic Information</h3>
                        <div className="stats-info">
                            <div className="stat-item">
                                <span className="stat-number">{totalArticles}</span>
                                <span className="stat-label">Total Number of Articles</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{filteredArticles.length}</span>
                                <span className="stat-label">Number of Articles displayed</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="articles-main">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loding...</p>
                        </div>
                    ) : (
                        <>
                            <div className="articles-toolbar">
                                <div className="results-info">
                                    Find {filteredArticles.length} Articles
                                    {selectedCategory !== 'All' && (
                                        <span className="category-filter">
                                            - {selectedCategory === 'Anxiety' ? 'Anxiety' :
                                               selectedCategory === 'Depression' ? 'Depression' :
                                               selectedCategory === 'Stress Management' ? 'Stress Management' :
                                               selectedCategory === 'Relationships' ? 'Relationships' :
                                               selectedCategory === 'Self Growth' ? 'Self Growth' :
                                               selectedCategory === 'Sleep Issues' ? 'Sleep Issues' :
                                               selectedCategory === 'Emotional Regulation' ? 'Emotional Regulation' : selectedCategory}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="articles-grid">
                                {filteredArticles.map(article => (
                                    <ArticleCard
                                        key={article.article_id}
                                        article={article}
                                        onClick={handleArticleClick}
                                    />
                                ))}
                            </div>

                            {filteredArticles.length === 0 && !isLoading && (
                                <div className="no-results">
                                    <img src={assets.Cloud_icon} alt="No results" />
                                    <h3>No related Articles Found</h3>
                                    <p>Try to apply other filters or categories</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <ArticleModal
                article={selectedArticle}
                articleDetail={articleDetail}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default Articles;
