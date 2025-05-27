package org.broky.backend;

import org.broky.backend.model.User;
import org.broky.backend.repository.UserRepository;
import org.broky.backend.service.impl.ChatServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import org.broky.backend.service.impl.ChatServiceImpl;


@SpringBootTest
class BackendApplicationTests {

	@Mock
	private UserRepository userRepository;

	@Mock
	private ChatServiceImpl chatServiceImpl;

}