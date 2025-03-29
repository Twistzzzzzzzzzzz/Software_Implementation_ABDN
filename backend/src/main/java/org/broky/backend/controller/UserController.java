package org.broky.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.broky.backend.model.User;
import org.broky.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;


@Tag(name = "UserController", description = "UserController")
@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@Operation(summary = "register", description = "register")
	@GetMapping("/register")
	public Mono<User> register() {
		User user = new User("148221", "broky", "126","2@2qq.com","2022-10-10");
		return userService.register(user);
	}

	// SelectAllUsers
	@Operation(summary = "SelectAllUsers", description = "SelectAllUsers")
	@GetMapping("/SelectAllUsers")
	public Mono<User> SelectAllUsers() {
		System.out.println("SelectAllUsers");
		return userService.SelectAllUsers();

	}

}
