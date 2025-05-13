package org.broky.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.broky.backend.model.User;
import org.broky.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Tag(name = "UserController", description = "UserController")
@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserService userService;

	// CreateUser
	@Operation(summary = "register", description = "register")
	@PostMapping
	public Mono<User> register(@RequestBody User user) {
		System.out.println("register");
		user.generateId();
		return userService.register(user);
	}

	// SelectAllUsers
	@Operation(summary = "SelectAllUsers", description = "SelectAllUsers")
	@GetMapping
	public Flux<User> SelectAllUsers() {
		System.out.println("SelectAllUsers");
		return userService.SelectAllUsers();
	}

	// SelectUserById
	@Operation(summary = "SelectUserById", description = "SelectUserById")
	@GetMapping("/{id}")
	public Mono<User> SelectUserById(@PathVariable String id) {
		System.out.println("SelectUserById");
		return userService.SelectUserById(id);
	}

	// UpdateUser
	@Operation(summary = "UpdateUser", description = "UpdateUser")
	@PutMapping("/{id}")
	public Mono<User> UpdateUser(
			@PathVariable String id,
			@RequestBody User updatedUser
	) {
		return userService.UpdateUser(id, updatedUser);
	}

	// DeleteUser
	@Operation(summary = "DeleteUser", description = "DeleteUser")
	@DeleteMapping("/{id}")
	public Mono<Void> DeleteUser(@PathVariable String id) {
		return userService.DeleteUser(id);
	}
}
