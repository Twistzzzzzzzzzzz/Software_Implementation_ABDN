package org.broky.backend;

import org.broky.backend.model.User;
import org.broky.backend.repository.UserRepository;
import org.broky.backend.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest
class BackendApplicationTests {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private UserServiceImpl userService;

	@Test
	void testRegisterUser() {
		User user = new User("broky", "126", "2@2qq.com", "2022-10-10");
		when(userRepository.save(any(User.class))).thenReturn(Mono.just(user));

		StepVerifier.create(userService.register(user))
				.expectNextMatches(savedUser -> savedUser.getId() != null)
				.verifyComplete();
	}

	@Test
	void testGetUserById_NotFound() {
		when(userRepository.findById(anyString())).thenReturn(Mono.empty());

		StepVerifier.create(userService.SelectUserById("invalid_id"))
				.expectErrorMessage("User Not Found")
				.verify();
	}
}
