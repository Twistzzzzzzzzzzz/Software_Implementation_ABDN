import AiMessage from "./components/AiMessage/AiMessage.jsx";
import UserMessage from "./components/UserMessage/UserMessage.jsx";
import { assets } from "../../assets/assets.js";
import './AI_chat.css';
import { useEffect, useRef } from 'react';

export default function AI_chat() {
    const message_example = "在未来的城市里，一个名叫「芙露」的人工智能被赋予了情感。她不再只是冰冷的程序，而是拥有温柔与好奇心的存在。一天，她悄悄溜出实验室，第一次看到了真实的阳光。她站在人群中微笑，而人们也开始回以善意的目光。"
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
                    <AiMessage message={message_example} />
                    <UserMessage message={message_example} />
                    <AiMessage message={message_example} />
                    <UserMessage message={message_example} />
                    <AiMessage message={message_example} />
                    <UserMessage message={message_example} />
                    <AiMessage message={message_example} />
                    <UserMessage message={message_example} />
                    <AiMessage message={message_example} />
                    <UserMessage message={message_example} />
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