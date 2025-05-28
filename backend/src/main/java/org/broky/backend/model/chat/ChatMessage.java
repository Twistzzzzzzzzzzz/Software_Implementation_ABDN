package org.broky.backend.model.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatMessage {

	@Id
	private Long id;

	private String userId;

	private String role; // "user" 或 "assistant"

	private String content;

	private LocalDateTime timestamp;
}
