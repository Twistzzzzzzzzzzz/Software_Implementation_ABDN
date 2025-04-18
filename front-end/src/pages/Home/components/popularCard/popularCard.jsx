import './popularCard.css'

function PopularCard() {
    return (
        <div className="popular-container">
            <div className="content">
                <div className="number">1.</div>
                <div className="text">
                    Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
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
