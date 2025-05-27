package org.broky.backend.model.chat;

import lombok.Data;

import java.util.List;

@Data
public class DeepseekResponse {
	private List<Choice> choices;

	@Data
	public static class Choice {
		private Message message;
	}

	@Data
	public static class Message {
		private String role;
		private String content;
	}
}
