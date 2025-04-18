import { assets } from '../../assets/assets'
import './Footer.css'

function Footer() {
    return (
        <div className = "footer">
            <div className='first-containter'>
                <img src={assets.web_icon} alt=""  className='web_icon'/>
                <div className='icon-text'>
                    <img src={assets.Twitter_icon}/>
                    <a href="https://x.com/">xxx@twitter.com</a>
                </div>
                <div className='icon-text'>
                    <img src={assets.Ins_icon}/>
                    <a href="https://www.instagram.com/">xxx@ins.com</a>
                </div>
                <div className='icon-text'>
                    <img src={assets.Youtube_icon}/>
                    <a href="https://www.youtube.com/">xxx@youtube.com</a>
                </div>
                <div className='icon-text'>
                    <img src={assets.Linkedin_icon}/>
                    <a href="https://www.linkedin.com/">xxx@Linkedin.com'</a>
                </div>
            </div>
            <div className='normal-container'>
                <b>More links</b>
                <ul>
                    <li><a href="">UI design</a></li>
                    <li><a href="">UX design</a></li>
                    <li><a href="">Wireframing</a></li>
                    <li><a href="">Diagramming</a></li>
                    <li><a href="">Brainstorming</a></li>
                </ul>
            </div>
            <div className='normal-container'>
                <b>Contact us</b>
                <ul>
                    <li><a href="">Design</a></li>
                    <li><a href="">Prototyping</a></li>
                    <li><a href="">Development features</a></li>
                    <li><a href="">Design system</a></li>
                    <li><a href="">Collaboration features</a></li>
                </ul>
            </div>
            <div className='normal-container'>
                <b>Privacy policy</b>
                <ul>
                    <li><a href="">Blog</a></li>
                    <li><a href="">Best practices</a></li>
                    <li><a href="">Colors</a></li>
                    <li><a href="">Color wheel</a></li>
                    <li><a href="">Support</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer