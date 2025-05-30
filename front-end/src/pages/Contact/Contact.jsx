import React, { useState, useEffect, useRef } from 'react';
import './Contact.css';
import { assets } from '../../assets/assets';

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
            const mockArticles = [
                {
                    id: 1,
                    title: '如何有效管理焦虑情绪',
                    excerpt: '焦虑是现代生活中常见的情绪反应，学会正确的管理方法可以帮助我们更好地应对生活中的挑战...',
                    content: `焦虑是现代生活中常见的情绪反应，它可能源于工作压力、人际关系或未来的不确定性。虽然适度的焦虑可以激发我们的潜能，但过度的焦虑会影响我们的日常生活和身心健康。

学会识别焦虑的早期信号是管理焦虑的第一步。常见的焦虑症状包括：心跳加速、呼吸急促、肌肉紧张、注意力难以集中等。当我们能够及时识别这些信号时，就可以采取相应的应对策略。

深呼吸是最简单有效的焦虑管理技巧之一。通过缓慢深长的呼吸，我们可以激活副交感神经系统，帮助身体放松。建议采用4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒。

正念冥想也是一个很好的选择。通过专注于当下的感受和体验，我们可以减少对未来的担忧和对过去的懊悔。每天花10-15分钟进行正念练习，可以显著改善焦虑症状。

认知重构是另一个重要的技巧。当我们感到焦虑时，往往是因为我们的思维模式过于消极或不现实。学会质疑和重新评估我们的想法，可以帮助我们建立更加平衡和现实的认知。

最后，建立良好的生活习惯也很重要。规律的作息、适度的运动、均衡的饮食都有助于维持情绪的稳定。如果焦虑症状持续严重，建议寻求专业心理咨询师的帮助。`,
                    category: '焦虑症',
                    author: '李心理医生',
                    authorTitle: '临床心理学博士',
                    date: '2024-01-15',
                    views: 1250,
                    likes: 89,
                    readTime: 8,
                    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: 2,
                    title: '走出抑郁的阴霾：重建内心的阳光',
                    excerpt: '抑郁症不仅仅是情绪低落，它是一种需要专业治疗的心理疾病。了解抑郁症的症状和治疗方法...',
                    content: `抑郁症是一种常见但严重的心理疾病，它不仅影响我们的情绪，还会影响我们的思维、行为和身体健康。理解抑郁症的本质是康复的第一步。

抑郁症的主要症状包括：持续的悲伤或空虚感、对日常活动失去兴趣、疲劳和精力不足、睡眠障碍、食欲变化、注意力难以集中、自我价值感低下，以及反复出现的死亡或自杀念头。

治疗抑郁症通常需要综合性的方法。心理治疗是核心治疗手段之一，认知行为疗法（CBT）被证明对抑郁症特别有效。它帮助患者识别和改变消极的思维模式和行为习惯。

药物治疗在某些情况下也是必要的，特别是对于中重度抑郁症患者。抗抑郁药物可以帮助调节大脑中的神经递质，改善情绪症状。

除了专业治疗，自我护理也很重要。建立规律的日常作息、进行适度的体育锻炼、保持社交联系、培养兴趣爱好都有助于康复。

家人和朋友的支持对抑郁症患者来说至关重要。理解、耐心和陪伴比任何建议都更有价值。记住，抑郁症是可以治疗的，康复是完全可能的。`,
                    category: '抑郁症',
                    author: '王心理咨询师',
                    authorTitle: '心理治疗师',
                    date: '2024-01-12',
                    views: 980,
                    likes: 67,
                    readTime: 10,
                    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: 3,
                    title: '压力管理：在快节奏生活中找到平衡',
                    excerpt: '现代生活节奏快，压力无处不在。学会有效的压力管理技巧，可以帮助我们在忙碌中保持身心健康...',
                    content: `在现代社会，压力已经成为我们生活中不可避免的一部分。工作压力、家庭责任、经济负担等各种因素都可能成为压力源。虽然适度的压力可以激发我们的潜能，但长期的高压状态会对身心健康造成严重影响。

首先，我们需要学会识别压力的来源。压力可能来自外部环境，如工作要求、人际关系冲突等；也可能来自内部，如完美主义倾向、自我期望过高等。明确压力源是制定有效应对策略的前提。

时间管理是压力管理的重要组成部分。学会合理安排时间、设定优先级、避免拖延可以显著减少压力。建议使用时间管理工具，如待办事项清单、时间块规划等。

放松技巧对缓解压力非常有效。除了深呼吸和冥想，还可以尝试渐进性肌肉放松、瑜伽、太极等方法。这些技巧可以帮助我们在紧张的工作间隙快速恢复平静。

建立良好的社会支持网络也很重要。与家人朋友分享压力和困扰，寻求他们的理解和支持，可以有效减轻心理负担。

最后，学会说"不"是压力管理的重要技能。我们不需要满足所有人的期望，适当拒绝超出能力范围的要求是保护自己的必要手段。`,
                    category: '压力管理',
                    author: '张心理专家',
                    authorTitle: '压力管理专家',
                    date: '2024-01-10',
                    views: 1450,
                    likes: 102,
                    readTime: 7,
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: 4,
                    title: '建立健康的人际关系：沟通的艺术',
                    excerpt: '良好的人际关系是心理健康的重要基础。学会有效沟通，建立互信互爱的关系...',
                    content: `人际关系是我们生活中不可或缺的一部分，它直接影响着我们的幸福感和心理健康。建立和维护健康的人际关系需要技巧、耐心和持续的努力。

有效沟通是建立良好人际关系的基础。这包括倾听技巧、表达技巧和非语言沟通。真正的倾听意味着全神贯注地关注对方，不仅听他们说什么，还要理解他们的感受和需求。

表达自己的想法和感受时，要诚实但也要考虑对方的感受。使用"我"语句而不是"你"语句可以减少防御性反应。例如，说"我感到被忽视了"比说"你总是忽视我"更容易被接受。

设定健康的边界是维护人际关系的重要方面。我们需要学会保护自己的时间、精力和情感，同时也要尊重他人的边界。清晰的边界有助于建立互相尊重的关系。

冲突是人际关系中不可避免的，关键是如何处理冲突。健康的冲突解决方式包括：保持冷静、专注于问题而不是人身攻击、寻找双赢的解决方案、必要时寻求妥协。

培养同理心可以大大改善我们的人际关系。试着从对方的角度看问题，理解他们的感受和动机。这不意味着我们必须同意对方的观点，但理解可以促进更好的沟通。

最后，记住人际关系需要时间和努力来建立和维护。投资时间在重要的关系上，定期联系，表达关心和感激，这些都有助于加深关系的质量。`,
                    category: '人际关系',
                    author: '陈心理顾问',
                    authorTitle: '人际关系专家',
                    date: '2024-01-08',
                    views: 890,
                    likes: 76,
                    readTime: 9,
                    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: 5,
                    title: '自我成长的旅程：发现内在的力量',
                    excerpt: '自我成长是一个终生的过程，它涉及自我认知、技能发展和价值观的形成...',
                    content: `自我成长是一个持续的过程，它涉及我们对自己的理解、技能的发展和价值观的形成。这个旅程没有终点，但每一步都能让我们变得更加完整和满足。

自我认知是自我成长的起点。这包括了解自己的优势和弱点、价值观和信念、情绪模式和行为习惯。可以通过反思、日记写作、心理测试或寻求他人反馈来提高自我认知。

设定有意义的目标是推动成长的重要动力。这些目标应该与我们的价值观一致，具有挑战性但又是可实现的。将大目标分解为小步骤，并定期评估进展。

学习新技能和知识可以拓展我们的能力和视野。这不仅包括专业技能，还包括情商、沟通技巧、创造力等软技能。保持好奇心和开放的心态是持续学习的关键。

面对挑战和挫折是成长过程中不可避免的。重要的是学会从失败中学习，将挫折视为成长的机会而不是失败的证明。培养韧性和适应能力可以帮助我们更好地应对困难。

建立积极的心态对自我成长至关重要。这包括练习感恩、专注于解决方案而不是问题、相信自己的能力等。积极的心态不是忽视问题，而是以建设性的方式面对挑战。

最后，记住自我成长是一个个人化的过程。每个人的成长路径都是独特的，不要与他人比较。专注于自己的进步，庆祝每一个小的成就。`,
                    category: '自我成长',
                    author: '刘成长导师',
                    authorTitle: '个人发展教练',
                    date: '2024-01-05',
                    views: 1120,
                    likes: 94,
                    readTime: 11,
                    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: 6,
                    title: '改善睡眠质量：夜晚的心理调适',
                    excerpt: '良好的睡眠对心理健康至关重要。了解睡眠障碍的原因和改善方法...',
                    content: `睡眠是维持身心健康的基本需求，但现代生活中的各种因素常常影响我们的睡眠质量。了解睡眠的重要性和改善睡眠的方法对心理健康具有重要意义。

睡眠不足会影响我们的情绪调节、认知功能和免疫系统。长期睡眠不足与抑郁、焦虑等心理问题密切相关。因此，改善睡眠质量是维护心理健康的重要措施。

建立规律的睡眠作息是改善睡眠的基础。尽量每天在同一时间上床睡觉和起床，即使在周末也要保持这个习惯。这有助于调节我们的生物钟。

创造良好的睡眠环境也很重要。卧室应该保持安静、黑暗和凉爽。避免在床上使用电子设备，因为蓝光会抑制褪黑素的分泌，影响睡眠。

睡前放松技巧可以帮助我们更容易入睡。可以尝试深呼吸、渐进性肌肉放松、冥想或听轻柔的音乐。建立一个固定的睡前例行程序，如洗澡、读书或写日记。

饮食和运动也会影响睡眠质量。避免在睡前几小时内摄入咖啡因、酒精或大量食物。规律的体育锻炼可以改善睡眠，但应避免在睡前进行剧烈运动。

如果睡眠问题持续存在，可能需要寻求专业帮助。睡眠障碍可能是其他心理或生理问题的症状，专业的评估和治疗是必要的。

记住，改善睡眠质量需要时间和耐心。不要因为短期内没有看到效果就放弃，坚持健康的睡眠习惯最终会带来改善。`,
                    category: '睡眠问题',
                    author: '赵睡眠专家',
                    authorTitle: '睡眠医学专家',
                    date: '2024-01-03',
                    views: 760,
                    likes: 58,
                    readTime: 6,
                    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                }
            ];
            setArticles(mockArticles);
            setFilteredArticles(mockArticles);
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