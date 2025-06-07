import './UserMessage.css'
import PropTypes from 'prop-types'
import { assets } from '../../../../assets/assets'
import { useState, useEffect } from 'react'

function UserMessage({ message }) {
    const [avatarSrc, setAvatarSrc] = useState(assets.User_avatar)

    useEffect(() => {
        const updateAvatar = () => {
            const storedAvatar = localStorage.getItem('user_avatar')
            if (storedAvatar) {
                setAvatarSrc(storedAvatar)
            } else {
                setAvatarSrc(assets.User_avatar)
            }
        }

        updateAvatar() // Initial load

        window.addEventListener('storage', updateAvatar) // Listen for changes in localStorage
        return () => {
            window.removeEventListener('storage', updateAvatar)
        }
    }, [])

    return (
        <div className="user-message-container">
            <div className="message-content">
                {/*<p>{message_example}</p>*/}
                <p>{message}</p>
            </div>
            <div className="user-avatar">
                <img src={avatarSrc} alt="User Avatar" />
            </div>
        </div>
    )
}

UserMessage.propTypes = {
    message: PropTypes.string.isRequired
}

export default UserMessage

