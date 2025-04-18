import './membershipCard.css'
import PropTypes from 'prop-types'

function MembershipCard({ theme = 'dark' }) {
    return (
        <div className={`membership-container ${theme}`}>
            <div className='membership-content'>
                <div className='membership-header'>
                    <h2>Membership</h2>
                    <div className='price'>
                        <span className='dollar'>$</span>
                        <span className='amount'>50</span>
                        <span className='period'>/ mo</span>
                    </div>
                </div>
                
                <p className='description'>
                    为您进行专业的心理评估，以及与最新AI心理大模型对话的机会，您将更好的了解当前的心理状况
                </p>

                <ul className='features-list'>
                    <li>每周一次任选类型的心理健康测试</li>
                    <li>一天20次使用AI心理大模型的机会</li>
                    <li>免费观看所有心理咨询系列视频</li>
                    <li>社区专属符号与实操课程</li>
                </ul>

                <button className='membership-button'>
                    Button
                </button>
            </div>
        </div>
    )
}

MembershipCard.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark'])
}

export default MembershipCard

