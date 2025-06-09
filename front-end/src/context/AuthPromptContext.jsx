import React, { createContext, useState, useContext } from 'react';

const AuthPromptContext = createContext(null);

export const useAuthPrompt = () => useContext(AuthPromptContext);

export const AuthPromptProvider = ({ children }) => {
    const [promptMessage, setPromptMessage] = useState('');
    const [isPromptVisible, setIsPromptVisible] = useState(false);

    // 新增：确认弹窗状态
    const [confirmPrompt, setConfirmPrompt] = useState({
        message: '',
        visible: false,
        onConfirm: null,
        onCancel: null,
    });

    const showPrompt = (message) => {
        setPromptMessage(message);
        setIsPromptVisible(true);
    };

    const hidePrompt = () => {
        setPromptMessage('');
        setIsPromptVisible(false);
    };

    // 新增：显示确认弹窗
    const showConfirmPrompt = (message, onConfirm, onCancel) => {
        setConfirmPrompt({
            message,
            visible: true,
            onConfirm,
            onCancel,
        });
    };
    const hideConfirmPrompt = () => {
        setConfirmPrompt({ message: '', visible: false, onConfirm: null, onCancel: null });
    };

    return (
        <AuthPromptContext.Provider value={{
            promptMessage,
            isPromptVisible,
            showPrompt,
            hidePrompt,
            confirmPrompt,
            showConfirmPrompt,
            hideConfirmPrompt
        }}>
            {children}
        </AuthPromptContext.Provider>
    );
}; 