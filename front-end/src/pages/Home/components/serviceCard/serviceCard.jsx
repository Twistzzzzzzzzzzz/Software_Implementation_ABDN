import './serviceCard.css'

function ServiceCard({ img, title, desc, buttonText, onClick }) {
    return (
        <div className='container'>
            <div className='cardContainer'>
                <div className='imgContainer'>
                    <img src={img} alt={title} />
                </div>
                <div className='textContainer'>
                    <b>{title}</b>
                    <span className='normalText'>
                        {desc}
                    </span>
                </div>
            </div>
            <button onClick={onClick}>{buttonText}</button>
        </div>
    )
}

export default ServiceCard