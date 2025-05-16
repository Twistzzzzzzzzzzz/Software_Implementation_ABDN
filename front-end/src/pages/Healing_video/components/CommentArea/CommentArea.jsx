import { useEffect, useRef, useState } from 'react'
import './CommentArea.scss'
import { assets } from '../../../../assets/assets.js'
import _ from 'lodash'
import classNames from 'classnames'
import { v4 as uuidV4 } from 'uuid'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

// 样例数据
// const sampleComments = [
//     {
//         rpid: '1',
//         user: {
//             uid: '10001',
//             avatar: assets.User_avatar,
//             uname: '张三',
//         },
//         content: '这个视频很有帮助，让我学到了很多！这个视频很有帮助，让我学到了很多！这个视频很有帮助，让我学到了很多！',
//         ctime: '05-20 14:30',
//         like: 128
//     },
//     {
//         rpid: '2',
//         user: {
//             uid: '10002',
//             avatar: assets.User_avatar,
//             uname: '李四',
//         },
//         content: '希望能有更多这样的内容',
//         ctime: '05-20 15:45',
//         like: 96
//     },
//     {
//         rpid: '3',
//         user: {
//             uid: '30009257',
//             avatar: assets.User_avatar,
//             uname: '黑马前端',
//         },
//         content: '感谢分享，非常实用的建议！',
//         ctime: '05-20 16:20',
//         like: 45
//     }
// ]

// 当前登录用户信息
const user = {
    uid: '30009257',
    avatar: assets.User_avatar,
    uname: '黑马前端',
}

// 导航 Tab 数组
const tabs = [
    { type: 'hot', text: '最热' },
    { type: 'time', text: '最新' },
]

// 封装Item组件
function Item({ item, onDel }) {
    return (
        <div className="reply-item">
            <div className="root-reply-avatar">
                <div className="bili-avatar">
                    <img
                        className="bili-avatar-img"
                        alt={`${item.user.uname}的头像`}
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
                        <span className="reply-like">点赞数: {item.like}</span>
                        {user.uid === item.user.uid && (
                            <span
                                className="delete-btn"
                                onClick={() => onDel(item.rpid)}
                            >
                                删除
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const CommentArea = ({ comments = [] }) => {
    // 兼容后端评论结构
    const formatComments = (commentsArr) => {
        if (!Array.isArray(commentsArr)) return [];
        return commentsArr.map((item) => ({
            rpid: item.comment_id || item.rpid || uuidV4(),
            user: {
                uid: item.user?.uid || 'unknown',
                avatar: item.user?.avatar || assets.User_avatar,
                uname: item.user?.uname || (item.user?.username) || '匿名',
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
    const handlePublish = () => {
        if (!content.trim()) {
            alert('请输入评论内容')
            return
        }

        const newComment = {
            rpid: uuidV4(),
            user: {
                uid: user.uid,
                avatar: user.avatar,
                uname: user.uname,
            },
            content: content.trim(),
            ctime: dayjs().format('MM-DD HH:mm'),
            like: 0,
        }

        setCommentList([newComment, ...commentList])
        setContent('')
        inputRef.current?.focus()
    }

    return (
        <div className="comment-area">
            <div className="reply-navigation">
                <ul className="nav-bar">
                    <li className="nav-title">
                        <span className="nav-title-text">评论</span>
                        <span className="total-reply">{commentList.length}</span>
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
                                src={user.avatar}
                                alt="用户头像"
                            />
                        </div>
                    </div>
                    <div className="reply-box-wrap">
                        <textarea
                            className="reply-box-textarea"
                            placeholder="发一条友善的评论"
                            ref={inputRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handlePublish()
                                }
                            }}
                        />
                        <div className="reply-box-send">
                            <div
                                className={classNames('send-text', {
                                    'send-disabled': !content.trim()
                                })}
                                onClick={handlePublish}
                            >
                                发布
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
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

CommentArea.propTypes = {
    comments: PropTypes.array
}

export default CommentArea