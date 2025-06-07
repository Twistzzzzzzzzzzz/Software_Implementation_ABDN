package org.broky.backend.service.impl;

import org.broky.backend.model.Resources.VideoComment;
import org.broky.backend.model.Resources.VideoDetailResponse;
import org.broky.backend.model.Resources.VideoListResponse;
import org.broky.backend.repository.FileBased.FBVideoCommentRepository;
import org.broky.backend.repository.FileBased.FBVideoRepository;
import org.broky.backend.repository.UserRepository;
import org.broky.backend.repository.VideoRepository;
import org.broky.backend.service.VideoService;
import org.broky.backend.service.OssService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class VideoServiceImpl implements VideoService {
    
    @Autowired
    private FBVideoRepository fbVideoRepository;
    
    @Autowired
    private FBVideoCommentRepository fbVideoCommentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OssService ossService;
    
    @Override
    public Mono<VideoListResponse> getVideoList(int size, int page) {
        return fbVideoRepository.findAll()
                .map(video -> new VideoListResponse.VideoListItem(
                        video.getVideo_id(),
                        video.getTitle(),
                        video.getPicture_address()
                ))
                .skip((long) (page - 1) * size)
                .take(size)
                .collectList()
                .flatMap(items ->
                        fbVideoRepository.count()
                            .map(total -> new VideoListResponse(total.intValue(), items))
                );
    }
    
    @Override
    public Mono<VideoDetailResponse> getVideoDetail(String videoId) {
        return fbVideoRepository.findById(videoId)
                .switchIfEmpty(Mono.error(new RuntimeException("Video not found")))
                .flatMap(video ->
                        fbVideoCommentRepository.findByVideoId(videoId)
                            .flatMap(comment -> userRepository.findById(comment.getUser_id())
                                    .map(user -> new VideoDetailResponse.CommentDetail(
                                            new VideoDetailResponse.UserInfo(
                                                    user.getId(),
                                                    user.getAvatar(),
                                                    user.getUsername()
                                            ),
                                            comment.getContent(),
                                            comment.getCtime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                                            comment.getComment_like().toString(),
                                            comment.getComment_id()
                                    ))
                                    .switchIfEmpty(Mono.just(new VideoDetailResponse.CommentDetail(
                                            new VideoDetailResponse.UserInfo("unknown", "", "Unknown User"),
                                            comment.getContent(),
                                            comment.getCtime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                                            comment.getComment_like().toString(),
                                            comment.getComment_id()
                                    )))
                            )
                            .collectList()
                            .map(comments -> {
                                VideoDetailResponse response = new VideoDetailResponse();
                                response.setVideo_id(video.getVideo_id());
                                response.setTitle(video.getTitle());
                                response.setContent_address(video.getContent_address());
                                response.setDescription(video.getDescription());
                                response.setComment(comments);
                                return response;
                            })
                );
    }
    
    @Override
    public Mono<VideoComment> createVideoComment(String videoId, String content, String userId) {


        // 这里保存是i
        return fbVideoRepository.findById(videoId)
                .switchIfEmpty(Mono.error(new RuntimeException("Video not found")))
                .flatMap(video -> {
                    VideoComment comment = new VideoComment();
                    comment.setVideo_id(videoId);
                    comment.setContent(content);
                    comment.setUser_id(userId);
                    comment.setComment_like(0);
                    comment.setCtime(LocalDateTime.now());
                    
                    return fbVideoCommentRepository.save(comment);
                });
    }
    
    @Override
    public Mono<Void> updateCommentLike(Long commentId, Integer originLike, Integer updateLike) {
        return fbVideoCommentRepository.updateCommentLike(commentId, updateLike);
    }
    
    @Override
    public Mono<String> uploadVideo(FilePart filePart) {
        return ossService.uploadFile(filePart, "videos");
    }
    
    @Override
    public Mono<String> uploadImage(FilePart filePart) {
        return ossService.uploadFile(filePart, "images");
    }
}
