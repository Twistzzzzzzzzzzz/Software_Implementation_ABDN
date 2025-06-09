package org.broky.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import static org.springframework.web.reactive.function.server.RouterFunctions.*;

@Configuration
public class SpaRouterConfig {

	@Bean
	public RouterFunction<ServerResponse> htmlRouter() {
		System.out.println("Initializing HTML Router for SPA...");
		return route(
				GET("/{path:^(?!api|static|actuator$).*$}"),
				request -> ServerResponse.ok().bodyValue(new ClassPathResource("/static/index.html"))
		);
	}
}
