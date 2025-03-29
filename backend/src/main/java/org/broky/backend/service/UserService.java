package org.broky.backend.service;

import org.broky.backend.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface UserService {
	Mono<User> register(User user);
	Flux<User> SelectAllUsers();
	Mono<User> SelectUserById(String id);
	Mono<User> UpdateUser(String id, User updatedUser);
	Mono<Void> DeleteUser(String id);
}
