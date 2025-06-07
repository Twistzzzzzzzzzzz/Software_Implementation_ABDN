package org.broky.backend.service;

import org.broky.backend.model.Resources.ArticleDetailResponse;
import org.broky.backend.model.Resources.ArticleListResponse;
import reactor.core.publisher.Mono;

public interface ArticleService {
    Mono<ArticleListResponse> getArticleList(int size, int page);
    Mono<ArticleDetailResponse> getArticleDetail(String articleId);
}
