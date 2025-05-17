import './VideoItem.css';

export default function VideoItem({ previewImg, title, onClick, small, isActive }) {
    return (
        <div className={`video-item${small ? ' video-item-small' : ''}${isActive ? ' active' : ''}`} onClick={onClick}>
            <div className="video-item-img-wrapper">
                <img src={previewImg} alt={title} className="video-item-img" />
            </div>
            <div className="video-item-title">{title}</div>
        </div>
    );
}
