package org.broky.backend.repository;

import org.broky.backend.model.ChatMessage;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChatMessageRepository extends ReactiveCrudRepository<ChatMessage, Long> {

	@Query("SELECT * FROM chat_message WHERE user_id = :userId ORDER BY timestamp DESC LIMIT :limit")
	Flux<ChatMessage> findHistoryByUserId(String userId, int limit);

	@Query("INSERT INTO chat_message (user_id, role, content, timestamp) VALUES (:userId, :role, :content, CURRENT_TIMESTAMP)")
	Mono<Void> insertMessage(@Param("userId") String userId,
	                         @Param("role") String role,
	                         @Param("content") String content);
	// 清空表中所有内容
	@Query("DELETE FROM chat_message WHERE user_id = :userId")
	Mono<Void> deleteByUserId(String userId);
}
