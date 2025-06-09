import './popularCard.css'
import { useNavigate } from 'react-router-dom';

function PopularCard({ number, title, summary, published_at, articleData }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/articles', { state: { article: articleData } });
    };
    // 限制summary最大长度
    const maxLen = 80;
    const displaySummary = summary && summary.length > maxLen
        ? summary.slice(0, maxLen) + '...'
        : summary;

    return (
        <div className="popular-container" onClick={handleClick} style={{cursor:'pointer'}}>
            <div className="content">
                <div className="number">{number}.</div>
                <div className="text">
                    <div style={{fontWeight:600, marginBottom:4}}>{title}</div>
                    <div>{displaySummary}</div>
                    {published_at && <div style={{fontSize:12, color:'#aaa', marginTop:6}}>Publish at: {published_at}</div>}
                </div>
                <div className="arrow-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default PopularCard
