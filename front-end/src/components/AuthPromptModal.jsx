import React from 'react';
import { useAuthPrompt } from '../context/AuthPromptContext';
import './AuthPromptModal.css'; // Assuming you'll create this CSS file for styling

const AuthPromptModal = () => {
    const { promptMessage, isPromptVisible, hidePrompt } = useAuthPrompt();

    if (!isPromptVisible) return null;

    return (
        <div className="auth-prompt-overlay">
            <div className="auth-prompt-modal">
                <p>{promptMessage}</p>
                <button onClick={hidePrompt}>确定</button>
            </div>
        </div>
    );
};

export default AuthPromptModal; 