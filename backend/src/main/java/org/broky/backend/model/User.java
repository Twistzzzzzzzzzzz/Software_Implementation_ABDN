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

	public void generateId() {
		this.setId(UUID.randomUUID().toString());
	}
}
