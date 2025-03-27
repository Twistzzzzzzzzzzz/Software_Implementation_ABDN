package org.broky.backend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.broky.backend.mapper.UserMapper;
import org.broky.backend.model.User;
import org.broky.backend.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {



	@Override
	public boolean register(User user) {
		return save(user);
	}

}