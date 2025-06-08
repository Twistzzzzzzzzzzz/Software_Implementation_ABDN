package org.broky.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.broky.backend.model.ApiResponse;
import org.broky.backend.model.Resources.ArticleDetailResponse;
import org.broky.backend.model.Resources.ArticleListResponse;
import org.broky.backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Tag(name = "ArticleController", description = "文章管理")
@RestController
@RequestMapping("/api/v1/resources")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    
    @Operation(summary = "获取文章列表")
    @GetMapping("/articles")
    public Mono<ApiResponse<ArticleListResponse>> getArticleList(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "1") int page) {
        return articleService.getArticleList(size, page)
                .map(ApiResponse::success)
                .onErrorResume(e -> Mono.just(ApiResponse.error(65, e.getMessage())));
    }

//    @Operation(summary = "获取文章详情")
//    @GetMapping("/articles/{article_id}")
//    public Mono<ApiResponse<ArticleDetailResponse>> getArticleDetail(@PathVariable String article_id) {
//        return articleService.getArticleDetail(article_id)
//                .map(ApiResponse::success)
//                .onErrorResume(e -> Mono.just(ApiResponse.error(87, e.getMessage())));
//    }

    // 点赞功能
//    @Operation(summary = "点赞文章")

}
