package org.broky.backend.repository;

import org.broky.backend.model.Video;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface VideoRepository extends ReactiveCrudRepository<Video, String> {
}
