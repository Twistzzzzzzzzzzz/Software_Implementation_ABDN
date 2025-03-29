package org.broky.backend.service;

import org.broky.backend.model.User;
import reactor.core.publisher.Mono;


public interface UserService {
	Mono<User> register(User user);
	Mono<User> SelectAllUsers();
}
