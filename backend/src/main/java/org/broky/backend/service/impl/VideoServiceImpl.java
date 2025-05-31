package org.broky.backend.service.impl;

import org.broky.backend.model.*;
import org.broky.backend.repository.UserRepository;
import org.broky.backend.repository.VideoCommentRepository;
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
    private VideoRepository videoRepository;
    
    @Autowired
    private VideoCommentRepository videoCommentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OssService ossService;
    
    @Override
    public Mono<VideoListResponse> getVideoList() {
        return videoRepository.findAll()
                .map(video -> new VideoListResponse.VideoListItem(
                        video.getVideoId(),
                        video.getTitle(),
                        video.getPictureAddress()
                ))
                .collectList()
                .map(items -> new VideoListResponse(items.size(), items));
    }
    
    @Override
    public Mono<VideoDetailResponse> getVideoDetail(String videoId) {
        return videoRepository.findById(videoId)
                .switchIfEmpty(Mono.error(new RuntimeException("Video not found")))
                .flatMap(video -> 
                    videoCommentRepository.findByVideoId(videoId)
                            .flatMap(comment -> userRepository.findById(comment.getUserId())
                                    .map(user -> new VideoDetailResponse.CommentDetail(
                                            new VideoDetailResponse.UserInfo(
                                                    user.getId(),
                                                    user.getAvatar(),
                                                    user.getUsername()
                                            ),
                                            comment.getContent(),
                                            comment.getCtime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                                            comment.getCommentLike().toString(),
                                            comment.getCommentId()
                                    ))
                                    .switchIfEmpty(Mono.just(new VideoDetailResponse.CommentDetail(
                                            new VideoDetailResponse.UserInfo("unknown", "", "Unknown User"),
                                            comment.getContent(),
                                            comment.getCtime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                                            comment.getCommentLike().toString(),
                                            comment.getCommentId()
                                    )))
                            )
                            .collectList()
                            .map(comments -> {
                                VideoDetailResponse response = new VideoDetailResponse();
                                response.setVideo_id(video.getVideoId());
                                response.setTitle(video.getTitle());
                                response.setContent_address(video.getContentAddress());
                                response.setDescription(video.getDescription());
                                response.setComment(comments);
                                return response;
                            })
                );
    }
    
    @Override
    public Mono<VideoComment> createVideoComment(String videoId, String content, String userId) {
        return videoRepository.findById(videoId)
                .switchIfEmpty(Mono.error(new RuntimeException("Video not found")))
                .flatMap(video -> {
                    VideoComment comment = new VideoComment();
                    comment.setVideoId(videoId);
                    comment.setContent(content);
                    comment.setUserId(userId);
                    comment.setCommentLike(0);
                    comment.setCtime(LocalDateTime.now());
                    
                    return videoCommentRepository.save(comment);
                });
    }
    
    @Override
    public Mono<Void> updateCommentLike(Long commentId, Integer originLike, Integer updateLike) {
        return videoCommentRepository.updateCommentLike(commentId, updateLike);
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
