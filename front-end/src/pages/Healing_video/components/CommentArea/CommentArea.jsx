import { useEffect, useRef, useState } from 'react'
import './CommentArea.scss'
import { assets } from '../../../../assets/assets.js'
import _ from 'lodash'
import classNames from 'classnames'
import { v4 as uuidV4 } from 'uuid'
import PropTypes from 'prop-types'
import request from '../../../../utils/request'
import { useAuthPrompt } from '../../../../context/AuthPromptContext'

// 当前登录用户信息（头像动态读取）
function useUserAvatar() {
    const [avatar, setAvatar] = useState(localStorage.getItem('user_avatar') || assets.User_avatar);
    useEffect(() => {
        const onStorage = () => {
            setAvatar(localStorage.getItem('user_avatar') || assets.User_avatar);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);
    // 允许Profile页面setItem时主动触发
    useEffect(() => {
        const interval = setInterval(() => {
            const current = localStorage.getItem('user_avatar') || assets.User_avatar;
            setAvatar(prev => prev !== current ? current : prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);
    return avatar;
}

// 导航 Tab 数组
const tabs = [
    { type: 'hot', text: 'Most Popular' },
    { type: 'time', text: 'Latest' },
]

// 封装Item组件
function Item({ item, onDel, onLike, currentUid }) {
    return (
        <div className="reply-item">
            <div className="root-reply-avatar">
                <div className="bili-avatar">
                    <img
                        className="bili-avatar-img"
                        alt={`${item.user.uname}'s avatar`}
                        src={item.user.avatar || assets.User_avatar}
                    />
                </div>
            </div>

            <div className="content-wrap">
                <div className="user-info">
                    <div className="user-name">{item.user.uname}</div>
                </div>
                <div className="root-reply">
                    <span className="reply-content">{item.content}</span>
                    <div className="reply-info">
                        <span className="reply-time">{item.ctime}</span>
                        <span className="reply-like" onClick={() => onLike(item)} style={{cursor:'pointer'}}>Likes: {item.like}</span>
                        {currentUid === item.user.uid && (
                            <span
                                className="delete-btn"
                                onClick={() => onDel(item.rpid)}
                            >
                                Delete
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const CommentArea = ({ comments = [], videoId }) => {
    // 获取当前用户uid（如有登录信息可用）
    const currentUid = localStorage.getItem('user_uid') || 'current';
    const userAvatar = useUserAvatar();
    const { showPrompt } = useAuthPrompt();
    // 兼容后端评论结构
    const formatComments = (commentsArr) => {
        if (!Array.isArray(commentsArr)) return [];
        return commentsArr.map((item) => ({
            rpid: item.comment_id || item.rpid || uuidV4(),
            user: {
                uid: item.user?.uid || 'unknown',
                avatar: item.user?.avatar || assets.User_avatar,
                uname: item.user?.uname || (item.user?.username) || 'Anonymous',
            },
            content: item.content,
            ctime: item.ctime || '',
            like: item.comment_like ? Number(item.comment_like) : (item.like || 0),
        }));
    };

    const [commentList, setCommentList] = useState(formatComments(comments));
    const [type, setType] = useState('hot')
    const [content, setContent] = useState('')
    const inputRef = useRef(null)
    const [posting, setPosting] = useState(false);

    // 当 comments props 变化时，更新评论列表
    useEffect(() => {
        setCommentList(formatComments(comments));
    }, [comments]);

    // 删除评论
    const handleDel = (id) => {
        setCommentList(commentList.filter(item => item.rpid !== id))
    }

    // 切换排序方式
    const handleTabChange = (type) => {
        setType(type)
        if (type === 'hot') {
            setCommentList(_.orderBy(commentList, 'like', 'desc'))
        } else {
            setCommentList(_.orderBy(commentList, 'ctime', 'desc'))
        }
    }

    // 发表评论
    const handlePublish = async () => {
        if (!content.trim()) {
            alert('Please enter comment content')
            return
        }
        if (!videoId) {
            alert('Unable to get video ID, cannot comment')
            return
        }
        setPosting(true);
        try {
            // 发表评论 POST，带token
            const token = localStorage.getItem('access_token') || '';
            const res = await request.post(`/api/v1/resources/video/comment/${videoId}`, {
                content: content.trim()
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // 判断返回状态码
            if (res && res.code === 0) {
                // 重新加载评论
                const detailRes = await request.get(`/api/v1/resources/video/${videoId}`);
                const detailData = detailRes.data;
                setCommentList(formatComments(detailData.comment || []));
                setContent('');
                inputRef.current?.focus();
                showPrompt('Comment posted successfully!');
            } else {
                alert('评论提交失败: ' + (res?.message || '未知错误'));
            }
        } catch (e) {
            alert('评论提交失败')
        } finally {
            setPosting(false);
        }
    }

    // 点赞评论
    const handleLike = async (comment) => {
        try {
            await request.put(`/api/v1/resources/video/comment-like/${comment.rpid}`, {
                origin_like: comment.like,
                update_like: comment.like + 1
            });
            setCommentList(commentList.map(item =>
                item.rpid === comment.rpid ? { ...item, like: item.like + 1 } : item
            ));
        } catch (e) {
            alert('点赞失败');
        }
    }

    return (
        <div className="comment-area">
            <div className="reply-navigation">
                <ul className="nav-bar">
                    <li className="nav-title">
                        <span className="nav-title-text">Comments</span>
                        {/* <span className="total-reply">{commentList.length}</span> */}
                    </li>
                    <li className="nav-sort">
                        {tabs.map(item => (
                            <span
                                key={item.type}
                                onClick={() => handleTabChange(item.type)}
                                className={classNames('nav-item', { active: type === item.type })}
                            >
                                {item.text}
                            </span>
                        ))}
                    </li>
                </ul>
            </div>

            <div className="reply-wrap">
                <div className="box-normal">
                    <div className="reply-box-avatar">
                        <div className="bili-avatar">
                            <img
                                className="bili-avatar-img"
                                src={userAvatar}
                                alt="User Avatar"
                            />
                        </div>
                    </div>
                    <div className="reply-box-wrap">
                        <textarea
                            className="reply-box-textarea"
                            placeholder="Post a comment"
                            ref={inputRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && !posting) {
                                    e.preventDefault()
                                    handlePublish()
                                }
                            }}
                            disabled={posting}
                        />
                        <div className="reply-box-send">
                            <div
                                className={classNames('send-text', {
                                    'send-disabled': !content.trim() || posting
                                })}
                                onClick={posting ? undefined : handlePublish}
                            >
                                {posting ? 'Publishing...' : 'Publish'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="reply-list">
                    {commentList.map(item => (
                        <Item
                            key={item.rpid}
                            item={item}
                            onDel={handleDel}
                            onLike={handleLike}
                            currentUid={currentUid}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

CommentArea.propTypes = {
    comments: PropTypes.array,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default CommentArea