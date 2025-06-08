import React, { createContext, useState, useContext } from 'react';

const AuthPromptContext = createContext(null);

export const useAuthPrompt = () => useContext(AuthPromptContext);

export const AuthPromptProvider = ({ children }) => {
    const [promptMessage, setPromptMessage] = useState('');
    const [isPromptVisible, setIsPromptVisible] = useState(false);

    const showPrompt = (message) => {
        setPromptMessage(message);
        setIsPromptVisible(true);
    };

    const hidePrompt = () => {
        setPromptMessage('');
        setIsPromptVisible(false);
    };

    return (
        <AuthPromptContext.Provider value={{ promptMessage, isPromptVisible, showPrompt, hidePrompt }}>
            {children}
        </AuthPromptContext.Provider>
    );
}; 