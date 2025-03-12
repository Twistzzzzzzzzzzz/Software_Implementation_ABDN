package org.broky.backend.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "HelloController", description = "The HelloController API")
@RestController
public class HelloController {

	@GetMapping("/hello")
	public String hello() {
		return "Hello, World!";
	}
}
