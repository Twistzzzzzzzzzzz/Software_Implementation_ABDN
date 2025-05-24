package org.broky.backend.service.impl;

import org.broky.backend.model.Comment;
import org.broky.backend.repository.CommentRepository;
import org.broky.backend.service.CommentService;
import org.broky.backend.util.CensorWordFilter;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private R2dbcEntityTemplate template;

    @Autowired
    private CensorWordFilter censorWordFilter;

    @Override
    public Flux<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @Override
    public Mono<Comment> createComment(Comment comment) {
        if (censorWordFilter.containsSensitiveWord(comment.getContent())) {
            return Mono.error(new IllegalArgumentException("Comments containing sensitive words are prohibited from being posted"));
        }
        comment.generateId();
        return template.insert(comment);
    }

    @Override
    public Mono<Void> deleteComment(String commentId, String userId) {
        return commentRepository.findById(commentId)
                .flatMap(comment -> {
                    if (!comment.getUser_id().equals(userId)) {
                        return Mono.error(new RuntimeException("You cannot delete this comment"));
                    }
                    return commentRepository.deleteById(commentId);
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Comment not exists")));
    }
}