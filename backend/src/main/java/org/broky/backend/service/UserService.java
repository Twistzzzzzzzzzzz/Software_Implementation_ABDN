package org.broky.backend.service;

import org.broky.backend.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface UserService {
	// User register
	Mono<User> register(User user);

	// User login
	Mono<User> login(String username, String password);

	// Get user information by id
	Mono<User> SelectUserById(String id);

	// Update user information
	Mono<User> UpdateUser(String id, User updatedUser);

	// Delete user
	Mono<Void> DeleteUser(String id);
}
