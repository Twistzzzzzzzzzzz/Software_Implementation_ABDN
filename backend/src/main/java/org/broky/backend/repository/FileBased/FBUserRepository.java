package org.broky.backend.repository.FileBased;

import org.broky.backend.model.User;
import org.broky.backend.util.JsonFileUtil;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Repository
public class FBUserRepository {

	private static final String FILE_PATH = "data/demo_data/user.json";

	public Flux<User> findAll() {
		List<User> list = JsonFileUtil.readListFromFile(FILE_PATH, User[].class);
		return Flux.fromIterable(list);
	}

	public Mono<User> findById(String id) {
		return Mono.fromCallable(() -> JsonFileUtil.readListFromFile(FILE_PATH, User[].class))
				.flatMapMany(Flux::fromIterable)
				.filter(user -> id.equals(user.getId()))
				.next();
	}

	public Mono<User> findByUsername(String username) {
		return Mono.fromCallable(() -> JsonFileUtil.readListFromFile(FILE_PATH, User[].class))
				.flatMapMany(Flux::fromIterable)
				.filter(user -> username.equals(user.getUsername()))
				.next();
	}

	public Mono<User> save(User user) {
		return Mono.fromCallable(() -> JsonFileUtil.readListFromFile(FILE_PATH, User[].class))
				.flatMap(list -> {
					list.removeIf(u -> user.getId() != null && user.getId().equals(u.getId()));

					if (user.getId() == null || user.getId().isEmpty()) {
						user.generateId();
					}
					System.out.println("Saving user: " + user);

					list.add(user);
					JsonFileUtil.writeListToFile(FILE_PATH, list);
					return Mono.just(user);
				});
	}

	public Mono<Void> deleteById(String id) {
		return Mono.fromCallable(() -> JsonFileUtil.readListFromFile(FILE_PATH, User[].class))
				.flatMap(list -> {
					boolean removed = list.removeIf(user -> id.equals(user.getId()));
					if (!removed) {
						return Mono.error(new RuntimeException("User not exists"));
					}
					JsonFileUtil.writeListToFile(FILE_PATH, list);
					return Mono.empty();
				});
	}
}
