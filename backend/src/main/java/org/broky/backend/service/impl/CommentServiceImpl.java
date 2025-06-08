package org.broky.backend.service.impl;

import org.broky.backend.model.Comment;
import org.broky.backend.repository.FileBased.FBCommentRepository;
import org.broky.backend.service.CommentService;
import org.broky.backend.util.CensorWordFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private FBCommentRepository fbCommentRepository;


    @Autowired
    private CensorWordFilter censorWordFilter;

    @Override
    public Flux<Comment> getAllComments() {
        return fbCommentRepository.findAll();
    }

    @Override
    public Mono<Comment> createComment(Comment comment) {
        if (censorWordFilter.containsSensitiveWord(comment.getContent())) {
            return Mono.error(new IllegalArgumentException("Comments containing sensitive words are prohibited from being posted"));
        }
        comment.generateId();
        return fbCommentRepository.save(comment);
    }

    @Override
    public Mono<Void> deleteComment(String commentId, String userId) {
        return fbCommentRepository.findById(commentId)
                .flatMap(comment -> {
                    if (!comment.getUser_id().equals(userId)) {
                        return Mono.error(new RuntimeException("You cannot delete this comment"));
                    }
                    return fbCommentRepository.deleteById(commentId);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Comment not exists")));
    }
}