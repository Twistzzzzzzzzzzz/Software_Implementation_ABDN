package org.broky.backend.model.chat;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Table("chat_message")
public class ChatMessage {
	@Id
	private Long id;

	@Column("user_id")
	private String userId;

	@Column("role")
	private String role;

	@Column("content")
	private String content;

	@Column("timestamp")
	private LocalDateTime timestamp;
}
