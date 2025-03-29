package org.broky.backend.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

	@Id
	private String id;

	private String username;

	private String password;

	private String email;

	@Column("register_time")
	private String reg_time;

	public User(String username, String password, String email, String reg_time) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.reg_time = reg_time;
		this.generateId();
	}

	public void generateId() {
		this.setId(UUID.randomUUID().toString());
	}
}
