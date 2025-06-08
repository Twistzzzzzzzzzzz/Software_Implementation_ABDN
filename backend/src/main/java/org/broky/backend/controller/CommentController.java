package org.broky.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.broky.backend.model.*;
import org.broky.backend.repository.FileBased.FBUserRepository;
import org.broky.backend.service.CommentService;
import org.broky.backend.service.JwtTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.WebExchangeBindException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Tag(name = "CommentController", description = "评论管理")
@RestController
@RequestMapping("/api/v1/resources")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    FBUserRepository fbUserRepository;

    @Autowired
    private JwtTokenService jwtTokenService;

    @ExceptionHandler(WebExchangeBindException.class)
    public Mono<ApiResponse<?>> handleValidationException(WebExchangeBindException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return Mono.just(ApiResponse.error(1, errorMessage));
    }

    @Operation(summary = "Get comment list")
    @GetMapping("/community/info")
    public Mono<ApiResponse<List<Comment>>> getAllComments() {
        return commentService.getAllComments()
                .collectList()
                .map(ApiResponse::success)
                .onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage())));
    }

    @Operation(summary = "Create comment")
    @PostMapping("/community")
    public Mono<ApiResponse<Comment>> createComment(
            @Valid @RequestBody Comment comment,
            @RequestHeader("Authorization") String authHeader) {
        return jwtTokenService.getUserIdFromToken(authHeader)
                .flatMap(userId ->
                        Mono.fromCallable(() -> {
                                    String username = fbUserRepository.findNameByID(userId);
                                    comment.setUser_id(userId);
                                    comment.setUser_name(username);
                                    return comment;
                                })
                                .subscribeOn(Schedulers.boundedElastic())
                                .flatMap(commentService::createComment)
                )
                .map(ApiResponse::success)
                .onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage())));
    }

    @Operation(summary = "Delete comment")
    @DeleteMapping("community/{commentId}")
    public Mono<ApiResponse<Void>> deleteComment(
            @PathVariable String commentId,
            @RequestHeader("Authorization") String authHeader) {
        return jwtTokenService.getUserIdFromToken(authHeader)
                .flatMap(userId -> commentService.deleteComment(commentId, userId))
                .then(Mono.just(ApiResponse.<Void>success()))
                .onErrorResume(e -> Mono.just(
                        ApiResponse.<Void>error(1, e.getMessage())
                ));
    }
}