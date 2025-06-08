package org.broky.backend.repository.FileBased;

import org.broky.backend.model.Resources.Article;
import org.broky.backend.util.JsonFileUtil;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Repository
public class FBArticleRepository {

	private final String filePath = "data/demo_data/article.json";

	public Flux<Article> findAll() {
		List<Article> list = JsonFileUtil.readListFromFile(filePath, Article[].class);
		return Flux.fromIterable(list);
	}

//	public Mono<Article> findById(String articleId) {
//		List<Article> list = JsonFileUtil.readListFromFile(filePath, Article[].class);
//		return Mono.justOrEmpty(list.stream()
//				.filter(article -> articleId.equals(article.getArticleId()))
//				.findFirst());
//	}
//
//	public Mono<Article> save(Article article) {
//		List<Article> list = JsonFileUtil.readListFromFile(filePath, Article[].class);
//
//		// 删除旧的同ID记录（如果有）
//		list.removeIf(a -> article.getArticleId().equals(a.getArticleId()));
//
//		// 添加新文章
//		list.add(article);
//
//		JsonFileUtil.writeListToFile(filePath, list);
//
//		return Mono.just(article);
//	}
//
//	public Mono<Void> deleteById(String articleId) {
//		List<Article> list = JsonFileUtil.readListFromFile(filePath, Article[].class);
//		list.removeIf(a -> articleId.equals(a.getArticleId()));
//		JsonFileUtil.writeListToFile(filePath, list);
//		return Mono.empty();
//	}
//	public Mono<Long> count() {
//		List<Article> list = JsonFileUtil.readListFromFile(filePath, Article[].class);
//		return Mono.just((long) list.size());
//	}
}
