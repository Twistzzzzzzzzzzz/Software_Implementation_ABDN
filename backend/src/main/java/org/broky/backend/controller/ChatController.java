package org.broky.backend.controller;


import io.swagger.v3.oas.annotations.tags.Tag;
import org.broky.backend.model.chat.ChatRequest;
import org.broky.backend.model.chat.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.broky.backend.service.ChatService;
import org.broky.backend.service.JwtTokenService;


import reactor.core.publisher.Mono;


@RestController
@Tag(description = "聊天管理", name = "ChatController")
@RequestMapping("api/chat")
public class ChatController {

	private final ChatService chatService;
	private final JwtTokenService jwtTokenService;

	@Autowired
	public ChatController(ChatService chatService, JwtTokenService jwtTokenService) {
		this.chatService = chatService;
		this.jwtTokenService = jwtTokenService;
	}

	@PostMapping
	public Mono<ChatResponse> getAIReply(@RequestHeader("Authorization") String authHeader,
	                                     @RequestBody ChatRequest request) {
		return jwtTokenService.getUserIdFromToken(authHeader)
				.flatMap(userId -> chatService.getAIReply(request, userId));
	}

	@DeleteMapping("/clear")
	public Mono<Void> clearChatHistory(@RequestHeader("Authorization") String authHeader) {

		return jwtTokenService.getUserIdFromToken(authHeader)
				.flatMap(chatService::clearChatHistory);
	}
}