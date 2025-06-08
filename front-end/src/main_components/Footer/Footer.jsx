import { assets } from '../../assets/assets'
import './Footer.css'

function Footer() {
    return (
        <div className = "footer">
            <div className='first-containter'>
                <div className="footer_web_info">
                    <img src={assets.web_icon} alt="" className='footer_web_icon'/>
                    <span className="footer_website_name">Lighthouse Minds</span>
                </div>
                <div className='icon-text'>
                    <img src={assets.Twitter_icon}/>
                    <a href="https://x.com/">https://Twitter.com</a>
                </div>
                <div className='icon-text'>
                    <img src={assets.Ins_icon}/>
                    <a href="https://www.instagram.com/">https://Ins.com</a>
                </div>
                <div className='icon-text'>
                    <img src={assets.Youtube_icon}/>
                    <a href="https://www.youtube.com/">https://YouTube.com</a>
                </div>
                <div className='icon-text'>
                    <img src={assets.Linkedin_icon}/>
                    <a href="https://www.linkedin.com/">https://Linkedin.com'</a>
                </div>
            </div>
            <div className='normal-container'>
                <b>Consultation Platforms</b>
                <ul>
                    <li><a href="https://www.xinli001.com" target="_blank" rel="noopener noreferrer">Shanxinli (xinli001.com)</a></li>
                    <li><a href="https://www.jiandanxinli.com" target="_blank" rel="noopener noreferrer">Jiandanxinli (jiandanxinli.com)</a></li>
                    <li><a href="https://www.tang-xinli.com" target="_blank" rel="noopener noreferrer">Tangxinli (tang-xinli.com)</a></li>
                    <li><a href="https://www.ydl.com" target="_blank" rel="noopener noreferrer">Yidianling (ydl.com)</a></li>
                    <li><a href="https://www.glowe.cn" target="_blank" rel="noopener noreferrer">Glowe (glowe.cn)</a></li>
                </ul>
            </div>
            <div className='normal-container'>
                <b>Article Resources</b>
                <ul>
                    <li><a href="https://www.psychologytoday.com/us" target="_blank" rel="noopener noreferrer">Psychology Today</a></li>
                    <li><a href="https://www.verywellmind.com" target="_blank" rel="noopener noreferrer">Verywell Mind</a></li>
                    <li><a href="https://www.spring.org.uk/" target="_blank" rel="noopener noreferrer">Psyblog</a></li>
                    <li><a href="https://www.psychreg.org" target="_blank" rel="noopener noreferrer">Psychreg</a></li>
                    <li><a href="https://www.psypost.org" target="_blank" rel="noopener noreferrer">PsyPost</a></li>
                </ul>
            </div>
            <div className='normal-container'>
                <b>Video Resources</b>
                <ul>
                    <li><a href="https://www.haoxinqing.com/video/qingshaonianjingshenxinlixiangguanwenti.html" target="_blank" rel="noopener noreferrer">Good Mood (Video)</a></li>
                    <li><a href="https://tv.cctv.com/2021/10/09/VIDAoPxWMPiKhOMXP6gSSemU211009.shtml" target="_blank" rel="noopener noreferrer">How We Fight Depression (CCTV)</a></li>
                    <li><a href="https://www.bilibili.com/video/BV1V4G4y1p7hG/" target="_blank" rel="noopener noreferrer">Listen to the Inner Voice of Children (Bilibili)</a></li>
                    <li><a href="https://www.unicef.org/videos/mental-health-sessions-helped-me-greatly" target="_blank" rel="noopener noreferrer">"Mental Health Has Greatly Relieved Me" (UNICEF)</a></li>
                    <li><a href="https://www.bilibili.com/video/BV1Lo4y1X7az/" target="_blank" rel="noopener noreferrer">Shocking! College Students' Psychological Crisis! (Bilibili)</a></li>
                </ul>
            </div>
            <div className="footer-copyright">
                ©Copyright 2024 Psychology Group - All rights Reserved
            </div>
        </div>
    )
}

export default Footer