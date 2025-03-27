package org.broky.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.broky.backend.model.User;
import org.broky.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "UserController", description = "UserController")
@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@Operation(summary = "register", description = "register")
	@GetMapping("/register")
	public boolean register() {
		User user = new User();
		return userService.register(user);
	}
}
