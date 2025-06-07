package org.broky.backend.service;

import org.broky.backend.model.Resources.VideoComment;
import org.broky.backend.model.Resources.VideoDetailResponse;
import org.broky.backend.model.Resources.VideoListResponse;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

public interface VideoService {
    Mono<VideoListResponse> getVideoList(int size, int page);
    Mono<VideoDetailResponse> getVideoDetail(String videoId);
    Mono<VideoComment> createVideoComment(String videoId, String content, String userId);
    Mono<Void> updateCommentLike(Long commentId, Integer originLike, Integer updateLike);
    Mono<String> uploadVideo(FilePart filePart);
    Mono<String> uploadImage(FilePart filePart);
}
