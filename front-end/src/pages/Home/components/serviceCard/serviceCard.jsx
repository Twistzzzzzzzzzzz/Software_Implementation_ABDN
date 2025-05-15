import './serviceCard.css'

function ServiceCard({ img, title, desc, buttonText }) {
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
            <button>{buttonText}</button>
        </div>
    )
}

export default ServiceCard