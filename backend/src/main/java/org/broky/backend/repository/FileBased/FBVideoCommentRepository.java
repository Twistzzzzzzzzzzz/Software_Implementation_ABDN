package org.broky.backend.repository.FileBased;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.broky.backend.model.Resources.VideoComment;
import org.broky.backend.util.JsonFileUtil;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;


@Repository
public class FBVideoCommentRepository {

	private static final String FILE_PATH = "data/demo_data/video_comment.json";

	private Mono<List<VideoComment>> readComments() {
		return Mono.fromSupplier(() -> JsonFileUtil.readListFromFile(FILE_PATH, VideoComment[].class));
	}

	private Mono<Void> writeComments(List<VideoComment> comments) {
		return Mono.fromRunnable(() -> JsonFileUtil.writeListToFile(FILE_PATH, comments));
	}

	public Flux<VideoComment> findByVideoId(String videoId) {
		return readComments()
				.flatMapMany(list -> Flux.fromIterable(
						list.stream()
								.filter(c -> videoId.equals(c.getVideo_id()))
								.toList()
				));
	}

	public Mono<Void> updateCommentLike(Long commentId, Integer newLike) {
		return readComments()
				.flatMap(list -> {
					list.stream()
							.filter(c -> commentId.equals(c.getComment_id()))
							.findFirst()
							.ifPresent(c -> c.setComment_like(newLike));
					return writeComments(list);
				});
	}

	public Flux<VideoComment> findAll() {
		return readComments().flatMapMany(Flux::fromIterable);
	}

	public Mono<VideoComment> findById(Long commentId) {
		return readComments()
				.flatMapMany(Flux::fromIterable)
				.filter(comment -> commentId.equals(comment.getComment_id()))
				.next();
	}

	public Mono<VideoComment> save(VideoComment comment) {
		return readComments()
				.flatMap(list -> {
					list.removeIf(c -> comment.getComment_id().equals(c.getComment_id()));
					list.add(comment);
					return writeComments(list).thenReturn(comment);
				});
	}
}
