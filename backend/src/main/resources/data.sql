-- 插入示例用户数据
INSERT IGNORE INTO user (id, username, password, email, avatar) VALUES
('user-001', 'testuser1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFuZYNlAebJ2qEYGLJ6ZZwO', 'test1@example.com', 'https://example.com/avatar1.jpg'),
('user-002', 'testuser2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFuZYNlAebJ2qEYGLJ6ZZwO', 'test2@example.com', 'https://example.com/avatar2.jpg');

-- 插入示例视频数据
INSERT IGNORE INTO video (video_id, title, description, content_address, picture_address, author_id) VALUES
('video-001', '示例视频标题1', '这是一个示例视频描述', 'https://example.com/video1.mp4', 'https://example.com/thumb1.jpg', 'user-001'),
('video-002', '示例视频标题2', '这是另一个示例视频描述', 'https://example.com/video2.mp4', 'https://example.com/thumb2.jpg', 'user-002');

-- 插入示例视频评论数据
INSERT IGNORE INTO video_comment (video_id, user_id, content, comment_like) VALUES
('video-001', 'user-002', '这个视频很棒！', 5),
('video-001', 'user-001', '感谢观看！', 2),
('video-002', 'user-001', '内容很有意思', 3);

-- 插入示例文章数据
INSERT IGNORE INTO article (article_id, title, summary, content, author_id) VALUES
('63', '抛一味大约横穿', 'reprehenderit sunt amet eu', '黑龙江省 安门市 勐腊县 席侬8号 19层', 'user-001'),
('68', '自从在修订聪明好何尝啊也许除了', 'reprehenderit sunt amet eu', '这是文章的完整内容...', 'user-001'),
('article-002', '另一篇示例文章', '这是文章摘要', '这是另一篇文章的完整内容...', 'user-002');
