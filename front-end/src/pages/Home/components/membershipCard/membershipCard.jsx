import './membershipCard.css'
import PropTypes from 'prop-types'

function MembershipCard({
    theme = 'dark',
    price = 50,
    period = '/ mo',
    description = '为您进行专业的心理评估，以及与最新AI心理大模型对话的机会，您将更好的了解当前的心理状况',
    features = [
        '每周一次任选类型的心理健康测试',
        '一天20次使用AI心理大模型的机会',
        '免费观看所有心理咨询系列视频',
        '社区专属符号与实操课程',
    ],
    buttonText = 'Button',
}) {
    return (
        <div className={`membership-container ${theme}`}>
            <div className='membership-content'>
                <div className='membership-header'>
                    <h2>Membership</h2>
                    <div className='price'>
                        <span className='dollar'>$</span>
                        <span className='amount'>{price}</span>
                        <span className='period'>{period}</span>
                    </div>
                </div>
                
                <p className='description'>
                    {description}
                </p>

                <ul className='features-list'>
                    {features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                    ))}
                </ul>

                <button className='membership-button'>
                    {buttonText}
                </button>
            </div>
        </div>
    )
}

MembershipCard.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    period: PropTypes.string,
    description: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
    buttonText: PropTypes.string,
}

export default MembershipCard

