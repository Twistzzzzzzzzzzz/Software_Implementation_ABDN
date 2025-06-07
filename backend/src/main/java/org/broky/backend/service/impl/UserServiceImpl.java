package org.broky.backend.service.impl;

import org.broky.backend.repository.FileBased.FBUserRepository;
import org.broky.backend.repository.UserRepository;
import org.broky.backend.model.User;
import org.broky.backend.service.UserService;
import org.broky.backend.util.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.Base64;

import java.nio.charset.StandardCharsets;


@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private FBUserRepository fbUserRepository;

	@Autowired
	private R2dbcEntityTemplate template;

	@Autowired
	private PasswordEncoderUtil passwordEncoder;

	@Override
	public Mono<User> register(User user) {
		System.out.println("Registering user: " + user.getUsername());
		return fbUserRepository.findByUsername(user.getUsername())
				.flatMap(existingUser -> {
					return Mono.error(new RuntimeException("Username already exists"));
				})
				.switchIfEmpty(Mono.defer(() -> {
					user.generateId();
					user.setPassword(passwordEncoder.encode(user.getPassword()));
					return fbUserRepository.save(user);
				}))
				.cast(User.class);
	}

	@Override
	public Mono<User> login(String username, String password) {
		return fbUserRepository.findByUsername(username)
				.flatMap(user -> {
					if (passwordEncoder.matches(password, user.getPassword())) {
						return Mono.just(user);
					} else {
						return Mono.error(new RuntimeException("Invalid password"));
					}
				})
				.switchIfEmpty(Mono.error(new RuntimeException("User not found")));
	}

	@Value("${app.avatar.max-size:2097152}")
	private int maxAvatarSize;

	@Override
	public Mono<User> UpdateUser(String id, User updatedUser) {
		return fbUserRepository.findById(id)
				.flatMap(existingUser -> {
					if (updatedUser.getUsername() != null &&
							!updatedUser.getUsername().equals(existingUser.getUsername())) {

						return fbUserRepository.findByUsername(updatedUser.getUsername())
								.flatMap(foundUser -> {
									if (!foundUser.getId().equals(id)) {
										return Mono.error(new RuntimeException("Username already exists"));
									}
									return updateFields(existingUser, updatedUser);
								})
								.switchIfEmpty(updateFields(existingUser, updatedUser));
					} else {
						return updateFields(existingUser, updatedUser);
					}
				});
	}

	private Mono<User> updateFields(User existingUser, User updatedUser) {
		boolean isModified = false;

		if (updatedUser.getPassword() != null &&
				!passwordEncoder.matches(updatedUser.getPassword(), existingUser.getPassword())) {
			existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
			isModified = true;
		}

		if (updatedUser.getEmail() != null &&
				!updatedUser.getEmail().equals(existingUser.getEmail())) {
			existingUser.setEmail(updatedUser.getEmail());
			isModified = true;
		}

		if (updatedUser.getAvatar() != null) {
			String base64Data = updatedUser.getAvatar();
			if (base64Data.contains(",")) {
				base64Data = base64Data.split(",")[1];
			}

			byte[] imageBytes;
			try {
				imageBytes = Base64.getDecoder().decode(base64Data);
			} catch (IllegalArgumentException e) {
				return Mono.error(new RuntimeException("Invalid Base64 format"));
			}

			if (imageBytes.length > maxAvatarSize) {
				return Mono.error(new RuntimeException(
						"Avatar exceeds maximum size of " + (maxAvatarSize / 1024 / 1024) + "MB"
				));
			}

			existingUser.setAvatar(updatedUser.getAvatar());
			isModified = true;
		}

		return isModified ? fbUserRepository.save(existingUser) : Mono.just(existingUser);
	}

	@Override
	public Mono<User> SelectUserById(String id) {
		return fbUserRepository.findById(id)
				.switchIfEmpty(Mono.error(new RuntimeException("User Not Found")));
	}

	@Override
	public Mono<Void> DeleteUser(String id) {
		return fbUserRepository.deleteById(id);
	}
}
