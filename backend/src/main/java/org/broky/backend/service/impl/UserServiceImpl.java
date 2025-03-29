package org.broky.backend.service.impl;

import org.broky.backend.repository.UserRepository;
import org.broky.backend.model.User;
import org.broky.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public Mono<User> register(User user) {
		return userRepository.save(user);
	}

	@Override
	public Mono<User> SelectAllUsers() {
		// 查找所有用户
		return userRepository.findAll().next();
	}
}
