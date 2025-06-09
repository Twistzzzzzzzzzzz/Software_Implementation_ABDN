import React, { useEffect, useRef, useState } from 'react';
import { useAuthPrompt } from '../context/AuthPromptContext';
import './AuthPromptModal.css';

const DURATION = 3000; // 3秒

export const ConfirmPromptModal = () => {
    const { confirmPrompt, hideConfirmPrompt } = useAuthPrompt();
    if (!confirmPrompt.visible) return null;
    return (
        <div className="auth-prompt-center-overlay">
            <div className="auth-prompt-center-modal">
                <div className="auth-prompt-message" style={{marginBottom:20, textAlign:'center'}}>{confirmPrompt.message}</div>
                <div style={{display:'flex', width:'100%', justifyContent:'center', gap:24, marginTop:8}}>
                    <button
                        className="auth-prompt-confirm-btn"
                        onClick={() => {
                            hideConfirmPrompt();
                            if (typeof confirmPrompt.onConfirm === 'function') confirmPrompt.onConfirm();
                        }}
                    >Confirm</button>
                </div>
            </div>
        </div>
    );
};

const AuthPromptModal = () => {
    const { promptMessage, isPromptVisible, hidePrompt } = useAuthPrompt();
    const [progress, setProgress] = useState(100);
    const timerRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isPromptVisible) {
            setProgress(100);
            timerRef.current = setTimeout(() => {
                hidePrompt();
            }, DURATION);
            // 进度条动画
            const start = Date.now();
            intervalRef.current = setInterval(() => {
                const elapsed = Date.now() - start;
                setProgress(Math.max(0, 100 - (elapsed / DURATION) * 100));
            }, 30);
        }
        return () => {
            clearTimeout(timerRef.current);
            clearInterval(intervalRef.current);
        };
    }, [isPromptVisible, hidePrompt]);

    if (!isPromptVisible) return null;

    return (
        <div className="auth-prompt-top-bar">
            <div className="auth-prompt-message">{promptMessage}</div>
            <div className="auth-prompt-progress-bar-wrapper">
                <div
                    className="auth-prompt-progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default AuthPromptModal; 