package org.broky.backend.repository.FileBased;

import org.broky.backend.model.Comment;
import org.broky.backend.util.JsonFileUtil;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Repository
public class FBCommentRepository {

	private static final String FILE_PATH = "data/demo_data/comment.json";

	public Flux<Comment> findAll() {
		return Mono.fromCallable(() -> JsonFileUtil.readListFromFile(FILE_PATH, Comment[].class))
				.subscribeOn(Schedulers.boundedElastic())  // 因为是阻塞 I/O，放在弹性线程池中
				.flatMapMany(Flux::fromIterable);
	}

	public Mono<Comment> findById(String commentId) {
		List<Comment> comments = JsonFileUtil.readListFromFile(FILE_PATH, Comment[].class);
		return Flux.fromIterable(comments)
				.filter(comment -> commentId.equals(comment.getId()))
				.next();
	}

	public Mono<Comment> save(Comment comment) {
		return Mono.fromCallable(() -> {

					// 1. 读取已有评论
					List<Comment> comments = JsonFileUtil.readListFromFile(FILE_PATH, Comment[].class);

					// 2. 添加新评论
					comments.add(comment);

					// 3. 写回文件
					JsonFileUtil.writeListToFile(FILE_PATH, comments);

					// 4. 返回新添加的评论
					return comment;
				})
				.subscribeOn(Schedulers.boundedElastic()); // ✅ 切换到阻塞IO安全线程池
	}

	public Mono<Void> deleteById(String commentId) {
		List<Comment> comments = JsonFileUtil.readListFromFile(FILE_PATH, Comment[].class);
		boolean removed = comments.removeIf(c -> commentId.equals(c.getId()));
		if (!removed) {
			return Mono.error(new RuntimeException("Comment not exists"));
		}
		JsonFileUtil.writeListToFile(FILE_PATH, comments);
		return Mono.empty();
	}
}

