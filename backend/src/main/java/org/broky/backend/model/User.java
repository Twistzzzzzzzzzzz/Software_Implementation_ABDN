package org.broky.backend.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("user")
public class User {

	@Id
	private String id;

	@Column("username")
	private String username;

	@Column("password")
	private String password;

	@Column("email")
	private String email;

	@Column("register_time")
	private LocalDateTime register_time;

	@Column("avatar")
	private String avatar;

	public void generateId() {
		long randomNum = ThreadLocalRandom.current().nextLong(100_000_000_000L, 1_000_000_000_000L);
		this.id = String.format("%010d", randomNum);
		this.register_time = LocalDateTime.now();
		this.avatar = "";
	}

}
