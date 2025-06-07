// 环境配置文件
const env = {
    // 应用名称
    appTitle: import.meta.env.VITE_APP_TITLE || 'Psychology Project',
    
    // 当前环境
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    
    // API相关
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://localhost:3000/api',
    
    // 图片CDN
    imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL || 'https://localhost:3000/images',

    // 后端路径
    backendPath: import.meta.env.VITE_BACKEND_PATH || 'http://localhost:8080',
    
    // 网站设置
    defaultPageSize: 10,
    maxImageUploadSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    
    // 缓存设置
    cacheDuration: 5 * 60 * 1000, // 5分钟
    
    // 主题设置
    defaultTheme: 'light',
    
    // 动画控制
    enableAnimations: true,
    
    // 错误处理
    errorReportingEnabled: true,
    
    // 用户设置
    userSessionTimeout: 12 * 60 * 60 * 1000, // 12小时
};

export default env; 