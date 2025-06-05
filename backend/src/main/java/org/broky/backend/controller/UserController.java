package org.broky.backend.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.broky.backend.model.*;
import org.broky.backend.service.JwtTokenService;
import org.broky.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Tag(name = "UserController", description = "UserController")
@RestController
@RequestMapping("/api/v1")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private JwtTokenService jwtTokenService;

	@Operation(summary = "register", description = "register")
	@PostMapping("/auth/register")
	public Mono<ApiResponse<User>> register(@RequestBody User user) {
		return userService.register(user)
				.map(ApiResponse::success)
				.onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage())));
	}

	@Operation(summary = "LoginUser", description = "LoginUser")
	@PostMapping("/auth/login")
	public Mono<ApiResponse<TokenResponse>> login(@RequestBody User user) {
		return userService.login(user.getUsername(), user.getPassword())
				.flatMap(userEntity -> {
					String access_token = jwtTokenService.generateAccessToken(userEntity.getUsername(), userEntity.getId());
					String refresh_token = jwtTokenService.generateRefreshToken(userEntity.getUsername(), userEntity.getId());

					TokenResponse tokenResponse = new TokenResponse(access_token, refresh_token);
					return Mono.just(ApiResponse.success(tokenResponse));
				})
				.onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage(), new TokenResponse())));
	}

	@Operation(summary = "SelectUserById", description = "SelectUserById")
	@GetMapping("user/info")
	public Mono<ApiResponse<User>> getCurrentUserInfo(@RequestHeader("Authorization") String authHeader) {
		return jwtTokenService.getUserIdFromToken(authHeader)
				.flatMap(userId -> userService.SelectUserById(userId))
				.map(user -> {
					user.setPassword(null);
					return user;
				})
				.map(ApiResponse::success)
				.onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage(), null)));
	}

	@Operation(summary = "UpdateUser", description = "UpdateUser")
	@PutMapping("user/update")
	public Mono<ApiResponse<User>> updateCurrentUser(
			@RequestHeader("Authorization") String authHeader,
			@RequestBody User updatedUser
	) {
		return jwtTokenService.getUserIdFromToken(authHeader)
				.flatMap(userId -> userService.UpdateUser(userId, updatedUser))
				.map(updated -> {
					updated.setPassword(null);
					return ApiResponse.success(updated);
				})
				.onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage(), null)));
	}

	@Operation(summary = "DeleteUser", description = "DeleteUser")
	@DeleteMapping("user/del")
	public Mono<ApiResponse<Void>> deleteCurrentUser(@RequestHeader("Authorization") String authHeader) {
		return jwtTokenService.getUserIdFromToken(authHeader)
				.flatMap(userId -> userService.DeleteUser(userId))
				.then(Mono.just(ApiResponse.<Void>success()))
				.onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage())));
	}
}
