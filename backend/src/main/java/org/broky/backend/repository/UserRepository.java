package org.broky.backend.repository;

import org.broky.backend.model.User;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<User, String> {


	@Query("INSERT INTO user (id, username, password, email, register_time) VALUES (:id, :username, :password, :email, :reg_time)")
	Mono<Void> insertUser(String id, String username, String password, String email, String reg_time);
}