-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建视频表
CREATE TABLE IF NOT EXISTS video (
    video_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_address VARCHAR(500),
    picture_address VARCHAR(500),
    author_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE SET NULL
);

-- 创建视频评论表
CREATE TABLE IF NOT EXISTS video_comment (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    comment_like INT DEFAULT 0,
    ctime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES video(video_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS article (
    article_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content LONGTEXT,
    author_id VARCHAR(36),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE SET NULL
);

-- 创建索引以提高查询性能
CREATE INDEX idx_video_author ON video(author_id);
CREATE INDEX idx_video_comment_video ON video_comment(video_id);
CREATE INDEX idx_video_comment_user ON video_comment(user_id);
CREATE INDEX idx_article_author ON article(author_id);
CREATE INDEX idx_article_published ON article(published_at);
