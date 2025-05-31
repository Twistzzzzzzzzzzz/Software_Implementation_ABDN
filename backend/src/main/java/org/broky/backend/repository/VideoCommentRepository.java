package org.broky.backend.repository;

import org.broky.backend.model.VideoComment;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface VideoCommentRepository extends ReactiveCrudRepository<VideoComment, Long> {
    
    Flux<VideoComment> findByVideoId(String videoId);
    
    @Modifying
    @Query("UPDATE video_comment SET comment_like = :newLike WHERE comment_id = :commentId")
    Mono<Void> updateCommentLike(Long commentId, Integer newLike);
}
