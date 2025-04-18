import './UserMessage.css'
import PropTypes from 'prop-types'
import { assets } from '../../../../assets/assets'

function UserMessage({ message }) {
    return (
        <div className="user-message-container">
            <div className="message-content">
                {/*<p>{message_example}</p>*/}
                <p>{message}</p>
            </div>
            <div className="user-avatar">
                <img src={assets.User_avatar} alt="User Avatar" />
            </div>
        </div>
    )
}

UserMessage.propTypes = {
    message: PropTypes.string.isRequired
}

export default UserMessage
