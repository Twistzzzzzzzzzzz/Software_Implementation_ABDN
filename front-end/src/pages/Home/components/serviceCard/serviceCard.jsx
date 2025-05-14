import {assets} from "../../../../assets/assets.js"
import './serviceCard.css'

function ServiceCard() {
    return (
        <div className='container'>
            <div className='cardContainer'>
                <div className='imgContainer'>
                    <img src={assets.Service_card} alt="Service Card" />
                </div>
                <div className='textContainer'>
                    <b>Free AI chat</b>
                    <span className='normalText'>
                        Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                    </span>
                </div>
            </div>
            <button>Begin</button>
        </div>
    )
}

export default ServiceCard