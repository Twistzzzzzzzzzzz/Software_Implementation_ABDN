package org.broky.backend.service;

import org.broky.backend.model.Comment;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CommentService {
    // get comment list
    Flux<Comment> getAllComments();

    // post comment
    Mono<Comment> createComment(Comment comment);

    // delete comment
    Mono<Void> deleteComment(String commentId, String userId);
}