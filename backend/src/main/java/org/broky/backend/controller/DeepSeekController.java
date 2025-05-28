package org.broky.backend.controller;


import org.broky.backend.model.ApiResponse;
import org.broky.backend.model.chat.ChatMessage;
import org.broky.backend.model.chat.ChatRequest;
import org.broky.backend.repository.ChatMessageRepository;
import org.broky.backend.service.JwtTokenService;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Comparator;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("/api/chat")
public class DeepSeekController {

	@Value("${spring.ai.deepseek.chat.options.prompt}")
	private String DEFAULT_PROMPT;

	private final ChatModel deepSeekChatModel;
	private final JwtTokenService jwtTokenService;
	private final ChatMessageRepository chatMessageRepository;




	public DeepSeekController  (ChatModel chatModel, JwtTokenService jwtTokenService, ChatMessageRepository chatMessageRepository) {
		this.deepSeekChatModel = chatModel;
		this.jwtTokenService = jwtTokenService;
		this.chatMessageRepository = chatMessageRepository;
	}

	@PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<String> chatStream(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
	                               @RequestBody Flux<ChatRequest> chatRequests) {
		// 先验证token，返回userId或错误
		Mono<String> userIdMono = jwtTokenService.getUserIdFromToken(authHeader);

		return userIdMono.flatMapMany(userId ->
				chatRequests.flatMap(chatRequest -> {
					// 1. 取最近10条历史消息并拼接上下文
					Mono<String> historyContextMono = chatMessageRepository.findHistoryByUserId(userId, 10)
							.take(10)
							.sort(Comparator.comparing(ChatMessage::getTimestamp))
							.collectList()
							.map(messages -> {
								StringBuilder sb = new StringBuilder();
								for (ChatMessage msg : messages) {
									sb.append(msg.getRole().equals("user") ? "User: " : "Assistant: ")
											.append(msg.getContent())
											.append("\n");
								}
								return sb.toString();
							});

					return historyContextMono.flatMapMany(historyContext -> {
						String promptText = DEFAULT_PROMPT + historyContext + "User: " + chatRequest.getMessage() + "\nAssistant:";
						Prompt prompt = new Prompt(promptText);

						Mono<Void> saveUserInput = chatMessageRepository.insertMessage(userId, "user", chatRequest.getMessage());

						AtomicReference<StringBuilder> fullReply = new AtomicReference<>(new StringBuilder());

						Flux<String> responseStream = deepSeekChatModel.stream(prompt)
								.map(resp -> {
									String part = resp.getResult().getOutput().getText();
									fullReply.get().append(part);
									return part;
								});

						return saveUserInput.thenMany(
								responseStream.concatWith(
										Mono.defer(() ->
												chatMessageRepository.insertMessage(userId, "assistant", fullReply.get().toString())
														.then(Mono.empty())
										)
								)
						);
					});
				})
		);
	}


	@DeleteMapping
	public Mono<ApiResponse<Object>> clearHistory(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
		return jwtTokenService.getUserIdFromToken(authHeader)
				.flatMap(userId -> chatMessageRepository.deleteByUserId(userId)
						.then(Mono.just(ApiResponse.success()))
				)
				.onErrorResume(e -> Mono.just(ApiResponse.error(500, "Fail to Delete Histry " + e.getMessage())));
	}
}
