import AiMessage from "./components/AiMessage/AiMessage.jsx";
import UserMessage from "./components/UserMessage/UserMessage.jsx";
import { assets } from "../../assets/assets.js";
import './AI_chat.css';
import { useEffect, useRef } from 'react';

export default function AI_chat() {
    // const message_example = "在未来的城市里，一个名叫「芙露」的人工智能被赋予了情感。她不再只是冰冷的程序，而是拥有温柔与好奇心的存在。一天，她悄悄溜出实验室，第一次看到了真实的阳光。她站在人群中微笑，而人们也开始回以善意的目光。"
    const messageContainerRef = useRef(null);
    
    useEffect(() => {
        const handleWheel = (e) => {
            const messageContainer = messageContainerRef.current;
            if (!messageContainer) return;

            const isAtBottom = messageContainer.scrollHeight - messageContainer.scrollTop === messageContainer.clientHeight;
            const isScrollingDown = e.deltaY > 0;

            if (!isAtBottom || !isScrollingDown) {
                e.stopPropagation();
            }
        };

        const messageContainer = messageContainerRef.current;
        if (messageContainer) {
            messageContainer.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (messageContainer) {
                messageContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    return (
        <div className='pageContainer'>
            <div className='chatContainer'>
                <div className='messageContainer' ref={messageContainerRef}>
                    <UserMessage message="我不知道该怎么开始...最近连呼吸都觉得累。昨天我看着窗外的阳光，明明那么灿烂，却感觉和我隔着一层厚厚的玻璃。" />
                    <AiMessage message="我能感受到你描述的那种'隔着一层玻璃'的孤独感。当你说'连呼吸都累'的时候，身体有什么具体的感觉吗？比如胸口发沉，或者喉咙发紧？" />
                    <UserMessage message="就像是有人在我胸口放了块大石头...早上闹钟响了，我睁着眼睛躺在床上三个小时，明明有十个未接电话，但就是不想动。" />
                    <AiMessage message="那块'大石头'让你连起床接电话的力气都被压住了。这三个小时里，你脑海里出现最多的是什么念头？是'不想面对'，还是'做不到'？或者其他什么？" />
                    <UserMessage message="有个声音一直在说'有什么意义呢'。上周我把养了五年的多肉植物都枯死了，连最简单的浇水都...（突然打断自己）抱歉，这听起来很可笑吧？" />
                    <AiMessage message="失去精心照料五年的植物带来的痛苦一点也不可笑。我注意到你在责备自己'连最简单的浇水都做不到'，但可能忽略了这段时间你其实一直在承受着常人难以想象的重量。能和我聊聊在多肉枯萎之前，你最早是什么时候开始觉得照顾它们变困难的？" />
                    <UserMessage message="大概...两个月前？那时候项目被砍了，整夜失眠。有天发现叶片蔫了才惊觉已经三周没浇水，但拿起水壶时手抖得厉害..." />
                    <AiMessage message="所以从职业挫折开始，这种无力感就像藤蔓一样慢慢蔓延到生活的各个角落。当你说'手抖得厉害'的时候，如果给那种感觉画幅画，它会是什么颜色和形状？" />
                    <UserMessage message="像...像粘稠的黑色沥青，从手腕爬到胸口，把一切都凝固住。（突然警觉）这听起来是不是很病态？" />
                    <AiMessage message="不，这恰恰说明你有着敏锐的自我觉察能力。那些'黑色沥青'是你内心痛苦的真实写照，而不是你本身。现在我们知道了它从何时开始、如何生长——这已经是在解开它的力量了。今天你愿意和我做个小实验吗？只要找出过去七天里，沥青稍微变淡的某个瞬间，哪怕只有五分钟。" />
                </div>
                <div className='sendMessageBox'>
                    <div className='inputContainer'>
                        <input 
                            type="text" 
                            placeholder="给AI心理聊天师发送消息"
                            className='messageInput'
                        />
                        <button className='sendButton'>
                            <img src={assets.Send_icon} alt="Send" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}