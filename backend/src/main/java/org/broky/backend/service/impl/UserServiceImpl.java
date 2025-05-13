package org.broky.backend.service.impl;

import org.broky.backend.repository.UserRepository;
import org.broky.backend.model.User;
import org.broky.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public Mono<User> register(User user) {
		return userRepository.insertUser(user.getId(), user.getUsername(), user.getPassword(), user.getEmail(), user.getReg_time())
				.then(Mono.just(user))
				.onErrorResume(e -> Mono.error(new RuntimeException("User Registration Failed")));
	}

	@Override
	public Flux<User> SelectAllUsers() {
		// 查找所有用户
		return userRepository.findAll();
	}

	@Override
	public Mono<User> SelectUserById(String id) {
		return userRepository.findById(id)
				.switchIfEmpty(Mono.error(new RuntimeException("User Not Found")));
	}

	@Override
	public Mono<User> UpdateUser(String id, User updatedUser) {
		return userRepository.findById(id)
				.flatMap(existingUser -> {
					existingUser.setUsername(updatedUser.getUsername());
					existingUser.setPassword(updatedUser.getPassword());
					existingUser.setEmail(updatedUser.getEmail());
					existingUser.setReg_time(updatedUser.getReg_time());
					return userRepository.save(existingUser);
				})
				.switchIfEmpty(Mono.error(new RuntimeException("User Not Found")));
	}

	@Override
	public Mono<Void> DeleteUser(String id) {
		return userRepository.deleteById(id);
	}
}
