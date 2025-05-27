package org.broky.backend.service;

import org.broky.backend.model.chat.ChatResponse;
import org.broky.backend.model.chat.ChatRequest;
import reactor.core.publisher.Mono;


public interface ChatService {
	Mono<ChatResponse> getAIReply(ChatRequest request, String userId);

	Mono<? extends Void> clearChatHistory(String userId);
}
