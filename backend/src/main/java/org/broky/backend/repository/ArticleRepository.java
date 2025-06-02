package org.broky.backend.repository;

import org.broky.backend.model.Article;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends ReactiveCrudRepository<Article, String> {
}
