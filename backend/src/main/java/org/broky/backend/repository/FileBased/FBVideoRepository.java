package org.broky.backend.repository.FileBased;

import org.broky.backend.model.Resources.Video;
import org.broky.backend.util.JsonFileUtil;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;


@Repository
public class FBVideoRepository {

	private static final String FILE_PATH = "data/demo_data/video.json";

	public Flux<Video> findAll() {
		return Mono.fromSupplier(() -> {
			try {
				return JsonFileUtil.readListFromFile(FILE_PATH, Video[].class);
			} catch (Exception e) {
				e.printStackTrace();
				return Collections.<Video>emptyList();
			}
		}).flatMapMany(Flux::fromIterable);
	}

	public Mono<Long> count() {
		return Mono.fromSupplier(() -> {
					try {
						return JsonFileUtil.readListFromFile(FILE_PATH, Video[].class);
					} catch (Exception e) {
						e.printStackTrace();
						return Collections.<Video>emptyList();
					}
				}).map(List::size)
				.map(Integer::longValue);
	}

	public Mono<Video> findById(String id) {
		return Mono.fromSupplier(() -> {
					try {
						return JsonFileUtil.readListFromFile(FILE_PATH, Video[].class);
					} catch (Exception e) {
						e.printStackTrace();
						return Collections.<Video>emptyList();
					}
				}).flatMapMany(Flux::fromIterable)
				.filter(video -> id.equals(video.getVideo_id()))
				.next();
	}

}
