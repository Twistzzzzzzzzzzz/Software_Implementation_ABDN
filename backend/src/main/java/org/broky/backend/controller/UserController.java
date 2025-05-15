package org.broky.backend.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.broky.backend.model.*;
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

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.access-token.expiration}")
	private long accessTokenExpirationMs;

	@Value("${jwt.refresh-token.expiration}")
	private long refreshTokenExpirationMs;

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
					String access_token = generateAccessToken(userEntity);
					String refresh_token = generateRefreshToken(userEntity);

					TokenResponse tokenResponse = new TokenResponse(access_token, refresh_token);
					return Mono.just(ApiResponse.success(tokenResponse));
				})
				.onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage(), new TokenResponse())));
	}

	private String generateAccessToken(User user) {
		SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

		Map<String, Object> claims = new HashMap<>();
		claims.put("username", user.getUsername());
		claims.put("userId", user.getId());
		claims.put("type", "access_token");

		return Jwts.builder()
				.setClaims(claims)
				.setSubject(user.getUsername())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + accessTokenExpirationMs))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}

	private String generateRefreshToken(User user) {
		SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

		Map<String, Object> claims = new HashMap<>();
		claims.put("username", user.getUsername());
		claims.put("userId", user.getId());
		claims.put("type", "refresh_token");

		return Jwts.builder()
				.setClaims(claims)
				.setSubject(user.getUsername())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpirationMs))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}

	@Operation(summary = "SelectUserById", description = "SelectUserById")
	@GetMapping("user/{id}/info")
	public Mono<ApiResponse<User>> SelectUserById(@PathVariable String id) {
		return userService.SelectUserById(id)
				.map(ApiResponse::success)
				.onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage(), {})));
	}

	@Operation(summary = "UpdateUser", description = "UpdateUser")
	@PutMapping("user/{id}/update")
	public Mono<ApiResponse<User>> UpdateUser(
			@PathVariable String id,
			@RequestBody User updatedUser
	) {
		User updateData = new User();
		updateData.setUsername(updatedUser.getUsername());
		updateData.setPassword(updatedUser.getPassword());
		updateData.setEmail(updatedUser.getEmail());
		updateData.setAvatar(updatedUser.getAvatar());

		return userService.UpdateUser(id, updateData)
				.flatMap(user -> {
					if (updatedUser.getUsername() != null &&
							!updatedUser.getUsername().equals(user.getUsername())) {
						return Mono.just(ApiResponse.error(1, "Username already exists", user));
					}
					return Mono.just(ApiResponse.success(user));
				});
	}

	@Operation(summary = "DeleteUser", description = "DeleteUser")
	@DeleteMapping("user/{id}")
	public Mono<ApiResponse<Void>> DeleteUser(@PathVariable String id) {
		return userService.DeleteUser(id)
				.then(Mono.just(ApiResponse.<Void>success()))
				.onErrorResume(e -> Mono.just(ApiResponse.error(1, e.getMessage())));
	}
}
