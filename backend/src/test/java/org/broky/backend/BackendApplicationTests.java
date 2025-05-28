package org.broky.backend;

import org.broky.backend.repository.UserRepository;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import static org.mockito.ArgumentMatchers.any;


@SpringBootTest
class BackendApplicationTests {

	@Mock
	private UserRepository userRepository;

	@Mock
	private ChatServiceImpl chatServiceImpl;

}