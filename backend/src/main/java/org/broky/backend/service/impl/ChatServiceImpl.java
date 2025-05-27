package org.broky.backend.service.impl;

import jakarta.annotation.PostConstruct;
import org.broky.backend.model.chat.ChatMessage;
import org.broky.backend.model.chat.ChatRequest;
import org.broky.backend.model.chat.ChatResponse;
import org.broky.backend.model.chat.DeepseekResponse;
import org.broky.backend.repository.ChatMessageRepository;
import org.broky.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
public class ChatServiceImpl implements ChatService {


	private final WebClient webClient;
	private final ChatMessageRepository chatMessageRepository;

	@Value("${deepseek.api.key}")
	private String apiKey;

	@Value("${deepseek.api.prompt}")
	private String systemRole;

	public ChatServiceImpl(WebClient.Builder webClientBuilder, ChatMessageRepository chatMessageRepository) {
		this.webClient = webClientBuilder
				.baseUrl("https://api.deepseek.com/v1/chat/completions")
				.build();
		this.chatMessageRepository = chatMessageRepository;
	}

	@Override
	public Mono<ChatResponse> getAIReply(ChatRequest request, String userId) {
		return chatMessageRepository.findHistoryByUserId(userId)
				.collectList()
				.flatMap(historyMessages -> {
							List<Map<String, String>> messages = new ArrayList<>();
							messages.add(Map.of("role", "system", "content", systemRole));

							for (ChatMessage msg : historyMessages) {
								messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
							}

							// 加入当前请求消息
							messages.add(Map.of("role", "user", "content", request.getMessage()));

							// 构建请求体
							Map<String, Object> body = Map.of(
									"model", "deepseek-chat",
									"messages", messages
							);

							return webClient.post()
									.contentType(MediaType.APPLICATION_JSON)
									.header("Authorization", "Bearer " + apiKey)
									.bodyValue(body)
									.retrieve()
									.bodyToMono(DeepseekResponse.class)
									.flatMap(response -> {
										String reply = response.getChoices().get(0).getMessage().getContent();

										ChatMessage userMsg = new ChatMessage();
										userMsg.setUserId(userId);
										userMsg.setRole("user");
										userMsg.setContent(request.getMessage());

										ChatMessage assistantMsg = new ChatMessage();
										assistantMsg.setUserId(userId);
										assistantMsg.setRole("assistant");
										assistantMsg.setContent(reply);

										return chatMessageRepository.insertMessage(userMsg.getUserId(), userMsg.getRole(), userMsg.getContent())
												.then(chatMessageRepository.insertMessage(assistantMsg.getUserId(), assistantMsg.getRole(), assistantMsg.getContent()))
												.thenReturn(new ChatResponse(reply));

									});
						}
				);

	}
	@Override
	public Mono<Void> clearChatHistory(String userId) {
		return chatMessageRepository.deleteByUserId(userId);
	}
}