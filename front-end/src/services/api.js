// 通用API服务

// 缓存对象
const cache = new Map();

// 默认配置
const DEFAULT_CONFIG = {
    baseUrl: '', // 开发环境下的API基础URL
    timeout: 10000, // 超时时间：10秒
    useCache: false, // 默认不使用缓存
    cacheDuration: 5 * 60 * 1000, // 缓存时间：5分钟
    retries: 0, // 默认不重试
    retryDelay: 1000, // 重试延迟：1秒
};

// 实际配置，可以被修改
let apiConfig = { ...DEFAULT_CONFIG };

// 配置API
export const configureApi = (config) => {
    apiConfig = { ...apiConfig, ...config };
};

// 实现请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 通用fetch封装
export const fetchWithConfig = async (url, options = {}) => {
    const fullUrl = options.absoluteUrl ? url : `${apiConfig.baseUrl}${url}`;
    const config = { ...options };
    
    // 添加超时处理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
    config.signal = controller.signal;
    
    try {
        // 检查缓存
        const cacheKey = `${config.method || 'GET'}-${fullUrl}-${JSON.stringify(config.body || {})}`;
        const useCache = options.useCache !== undefined ? options.useCache : apiConfig.useCache;
        
        if (useCache && config.method === 'GET' && cache.has(cacheKey)) {
            const cachedData = cache.get(cacheKey);
            if (Date.now() < cachedData.expiry) {
                return cachedData.data;
            } else {
                cache.delete(cacheKey); // 缓存过期，删除
            }
        }
        
        // 实现重试机制
        const maxRetries = options.retries !== undefined ? options.retries : apiConfig.retries;
        const retryDelay = options.retryDelay || apiConfig.retryDelay;
        let response;
        let error;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    await delay(retryDelay);
                    console.log(`尝试第 ${attempt} 次重试请求: ${fullUrl}`);
                }
                
                response = await fetch(fullUrl, config);
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                break; // 成功，跳出重试循环
            } catch (err) {
                error = err;
                if (attempt === maxRetries) {
                    throw error; // 所有重试都失败
                }
            }
        }
        
        // 解析响应
        const data = await response.json();
        
        // 缓存处理
        if (useCache && config.method === 'GET') {
            const cacheDuration = options.cacheDuration || apiConfig.cacheDuration;
            cache.set(cacheKey, {
                data,
                expiry: Date.now() + cacheDuration
            });
        }
        
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error(`请求超时: ${fullUrl}`);
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

// HTTP方法简化函数
export const api = {
    // GET请求
    async get(url, params = {}, options = {}) {
        const queryParams = new URLSearchParams(params).toString();
        const fullUrl = queryParams ? `${url}?${queryParams}` : url;
        return fetchWithConfig(fullUrl, { 
            method: 'GET', 
            ...options 
        });
    },
    
    // POST请求
    async post(url, data = {}, options = {}) {
        return fetchWithConfig(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data),
            ...options
        });
    },
    
    // PUT请求
    async put(url, data = {}, options = {}) {
        return fetchWithConfig(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data),
            ...options
        });
    },
    
    // DELETE请求
    async delete(url, options = {}) {
        return fetchWithConfig(url, {
            method: 'DELETE',
            ...options
        });
    },
    
    // 上传文件
    async upload(url, formData, options = {}) {
        return fetchWithConfig(url, {
            method: 'POST',
            body: formData,
            ...options
        });
    },
    
    // 清除缓存
    clearCache() {
        cache.clear();
    },
    
    // 清除特定URL的缓存
    clearCacheForUrl(url, method = 'GET') {
        const cachePrefix = `${method}-${apiConfig.baseUrl}${url}`;
        
        // 删除所有匹配的缓存项
        for (const key of cache.keys()) {
            if (key.startsWith(cachePrefix)) {
                cache.delete(key);
            }
        }
    }
};

export default api; 