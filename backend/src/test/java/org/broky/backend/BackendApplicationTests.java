package org.broky.backend;

import com.baomidou.mybatisplus.core.toolkit.Assert;
import org.broky.backend.mapper.UserMapper;
import org.broky.backend.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private UserMapper userMapper;

	@Test
	void contextLoads() {
	}

	@Test
	public void testSelect() {
		System.out.println(("----- selectAll method test ------"));
		List<User> userList = userMapper.selectList(null);
		Assert.isTrue(5 == userList.size(), "");
		userList.forEach(System.out::println);
	}
}
