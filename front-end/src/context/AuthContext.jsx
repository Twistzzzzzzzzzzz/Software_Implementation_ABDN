import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建认证上下文
const AuthContext = createContext(null);

// 自定义钩子，方便组件获取上下文
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('light');
    
    // 检查本地存储中的用户信息和主题
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedTheme = localStorage.getItem('theme');
        
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('解析用户数据失败', error);
                localStorage.removeItem('user');
            }
        }
        
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
        
        setLoading(false);
    }, []);
    
    // 登录函数
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };
    
    // 登出函数
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };
    
    // 切换主题
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };
    
    // 提供用户认证状态和方法
    const value = {
        user,
        loading,
        theme,
        isAuthenticated: !!user,
        login,
        logout,
        toggleTheme
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 