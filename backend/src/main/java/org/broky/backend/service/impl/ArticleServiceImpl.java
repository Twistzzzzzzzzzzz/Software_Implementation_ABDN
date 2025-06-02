package org.broky.backend.service.impl;

import org.broky.backend.model.ArticleDetailResponse;
import org.broky.backend.model.ArticleListResponse;
import org.broky.backend.repository.ArticleRepository;
import org.broky.backend.repository.UserRepository;
import org.broky.backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.format.DateTimeFormatter;

@Service
public class ArticleServiceImpl implements ArticleService {
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public Mono<ArticleListResponse> getArticleList(int size, int page) {
        return articleRepository.findAll()
                .map(article -> new ArticleListResponse.ArticleListItem(
                        article.getArticleId(),
                        article.getTitle(),
                        article.getSummary(),
                        article.getPublishedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                ))
                .skip((long) (page - 1) * size)
                .take(size)
                .collectList()
                .flatMap(items -> 
                    articleRepository.count()
                            .map(total -> new ArticleListResponse(total.intValue(), items))
                );
    }

    @Override
    public Mono<ArticleDetailResponse> getArticleDetail(String articleId) {
        return articleRepository.findById(articleId)
                .switchIfEmpty(Mono.error(new RuntimeException("Article not found")))
                .flatMap(article -> 
                    userRepository.findById(article.getAuthorId())
                            .map(user -> new ArticleDetailResponse(
                                    article.getArticleId(),
                                    article.getTitle(),
                                    article.getContent(),
                                    user.getUsername()
                            ))
                            .switchIfEmpty(Mono.just(new ArticleDetailResponse(
                                    article.getArticleId(),
                                    article.getTitle(),
                                    article.getContent(),
                                    "Unknown Author"
                            )))
                );
    }
}
