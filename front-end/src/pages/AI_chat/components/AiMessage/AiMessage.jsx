import './AiMessage.css'
import PropTypes from 'prop-types'
import { assets } from '../../../../assets/assets'

function AiMessage({ message }) {
    return (
        <div className="ai-message-container">
            <div className="ai-avatar">
                <img src={assets.Ai_avatar} alt="AI Avatar" />
            </div>
            <div className="message-content">
                <p>{message}</p>
            </div>
        </div>
    )
}

AiMessage.propTypes = {
    message: PropTypes.string.isRequired
}

export default AiMessage

