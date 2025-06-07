package org.broky.backend.repository;

import org.broky.backend.model.Resources.VideoComment;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface VideoCommentRepository extends ReactiveCrudRepository<VideoComment, Long> {

}
