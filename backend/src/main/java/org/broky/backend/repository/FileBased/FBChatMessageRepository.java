package org.broky.backend.repository.FileBased;

import org.broky.backend.util.JsonFileUtil;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.broky.backend.model.chat.ChatMessage;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class FBChatMessageRepository {

	private static final String filePath = "data/demo_data/chat_message.json";


	public Flux<ChatMessage> findHistoryByUserId(String userId, int limit) {
		List<ChatMessage> all = JsonFileUtil.readListFromFile(filePath, ChatMessage[].class);
		List<ChatMessage> filtered = all.stream()
				.filter(m -> m.getUserId().equals(userId))
				.sorted(Comparator.comparing(ChatMessage::getTimestamp).reversed())
				.limit(limit)
				.collect(Collectors.toList());
		return Flux.fromIterable(filtered);
	}


	public Mono<Void> insertMessage(String userId, String role, String content) {
		List<ChatMessage> all = JsonFileUtil.readListFromFile(filePath, ChatMessage[].class);

		ChatMessage newMessage = new ChatMessage(
				UUID.randomUUID().getMostSignificantBits() & Long.MAX_VALUE,
				userId,
				role,
				content,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)
		);

		all.add(newMessage);
		JsonFileUtil.writeListToFile(filePath, all);
		return Mono.empty();
	}


	public Mono<Void> deleteByUserId(String userId) {
		List<ChatMessage> all = JsonFileUtil.readListFromFile(filePath, ChatMessage[].class);
		all.removeIf(m -> m.getUserId().equals(userId));
		JsonFileUtil.writeListToFile(filePath, all);
		return Mono.empty();
	}
}
