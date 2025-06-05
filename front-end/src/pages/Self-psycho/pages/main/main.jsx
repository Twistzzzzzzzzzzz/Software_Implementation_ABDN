import { assets } from '../../../../assets/assets'
import './main.css'
import { Link } from 'react-router-dom'

export default function Main() {
    return(
        <div className="main-container">
            <div className="anxiety-test">
                <h1>Anxiety Test</h1>
                <ul>
                    <li>Feeling nervous, restless, or irritable</li>
                    <li>Inability to stop or control worrying</li>
                    <li>Worrying too much about different things</li>
                    <li>Finding it difficult to relax</li>
                    <li>Getting upset or irritable easily</li>
                </ul>
                <button><Link to='/self-psycho/anxiety'>Start</Link></button>
            </div>

            <div className="depression-test">
                <h1>Depression Test</h1>
                <ul>
                    <li>Feeling low, depressed, or irritable</li>
                    <li>Difficulty falling asleep or sleeping too much</li>
                    <li>Very poor appetite or overeating</li>
                    <li>Feeling insecure or disappointed in yourself</li>
                </ul>
                <button><Link to='/self-psycho/depression'>Start</Link></button>
            </div>

            <div className="career-test">
                <h1>Career Test</h1>
                <ul>
                    <li>Feeling stuck in a job you don't like</li>
                    <li>Feeling unmotivated or uninspired at work</li>
                    <li>Feeling like you're not making progress</li>
                    <li>Feeling like you're not being challenged</li>
                </ul>
                <button><Link to='/self-psycho/career'>Start</Link></button>
            </div>
        </div>
    )
}