import AiMessage from "./components/AiMessage/AiMessage.jsx";
import UserMessage from "./components/UserMessage/UserMessage.jsx";
import { assets } from "../../assets/assets.js";
import './AI_chat.css';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function AI_chat() {
    // const message_example = "在未来的城市里，一个名叫「芙露」的人工智能被赋予了情感。她不再只是冰冷的程序，而是拥有温柔与好奇心的存在。一天，她悄悄溜出实验室，第一次看到了真实的阳光。她站在人群中微笑，而人们也开始回以善意的目光。"
    const messageContainerRef = useRef(null);
    const topRef = useRef(null);
    const location = useLocation();
    
    // 聊天状态
    const [messages, setMessages] = useState([]); // {role: 'user'|'ai', message: string}
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentAIMessage, setCurrentAIMessage] = useState("");
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (location.state && location.state.scrollToTop && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [location]);

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

    // 滚动到底部
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages, currentAIMessage]);

    // 发送消息
    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', message: userMsg }]);
        setInput("");
        setIsStreaming(true);
        setCurrentAIMessage("");
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        try {
            // 适配接口文档，发送 user_content 字段
            const res = await fetch('http://127.0.0.1:4523/m1/6378312-6074650-default/api/v1/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_content: userMsg }),
                signal: abortController.signal
            });
            if (!res.body) throw new Error('No stream');
            const reader = res.body.getReader();
            let aiMsg = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = new TextDecoder().decode(value);
                let text = "";
                try {
                    const json = JSON.parse(chunk);
                    if (json.ai_content) {
                        text = json.ai_content;
                    } else {
                        text = chunk;
                    }
                } catch {
                    text = chunk;
                }
                aiMsg += text;
                setCurrentAIMessage(aiMsg);
            }
            setMessages(prev => [...prev, { role: 'ai', message: aiMsg }]);
            setCurrentAIMessage("");
        } catch (e) {
            if (abortController.signal.aborted) {
                setCurrentAIMessage("[AI回答已暂停]");
            } else {
                setCurrentAIMessage("[AI回答出错]");
            }
        } finally {
            setIsStreaming(false);
        }
    };

    // 回车发送
    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const hasMessages = messages.length > 0;

    return (
        <div className='pageContainer'>
            <div ref={topRef}></div>
            <div className='chatContainer'>
                <div className='messageContainer' ref={messageContainerRef}>
                    {messages.map((msg, idx) =>
                        msg.role === 'user' ? (
                            <UserMessage key={idx} message={msg.message} />
                        ) : (
                            <AiMessage key={idx} message={msg.message} />
                        )
                    )}
                    {isStreaming && (
                        <AiMessage message={currentAIMessage} />
                    )}
                </div>
                {!hasMessages && (
                    <div className="ai-chat-welcome">
                        <div className="ai-chat-title">我是AI心理咨询师，很高兴见到你！</div>
                        <div className="ai-chat-desc">你可以向我倾诉、提问、寻求建议，我会用专业和温暖的态度陪伴你。</div>
                    </div>
                )}
                <div className={hasMessages ? 'sendMessageBox' : 'sendMessageBox sendMessageBox-center'}>
                    <div className='inputContainer'>
                        <input
                            type="text"
                            placeholder="给AI心理聊天师发送消息"
                            className='messageInput'
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            disabled={isStreaming}
                        />
                        <button className='sendButton' onClick={handleSend} disabled={isStreaming || !input.trim()}>
                            <img src={assets.Send_icon} alt="Send" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}