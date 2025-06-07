package org.broky.backend.repository.FileBased;

import org.broky.backend.model.Comment;
import org.broky.backend.util.JsonFileUtil;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Repository
public class FBCommentRepository {

	private static final String FILE_PATH = "data/demo_data/comment.json";

	public Flux<Comment> findAll() {
		List<Comment> comments = JsonFileUtil.readListFromFile(FILE_PATH, Comment[].class);
		return Flux.fromIterable(comments);
	}

	public Mono<Comment> findById(String commentId) {
		List<Comment> comments = JsonFileUtil.readListFromFile(FILE_PATH, Comment[].class);
		return Flux.fromIterable(comments)
				.filter(comment -> commentId.equals(comment.getId()))
				.next();
	}

	public Mono<Comment> save(Comment comment) {
		List<Comment> comments = JsonFileUtil.readListFromFile(FILE_PATH, Comment[].class);
		comments.removeIf(c -> comment.getId().equals(c.getId()));
		comments.add(comment);
		JsonFileUtil.writeListToFile(FILE_PATH, comments);
		return Mono.just(comment);
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

