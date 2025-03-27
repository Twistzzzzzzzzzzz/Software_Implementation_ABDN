package org.broky.backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.broky.backend.model.User;


public interface UserService extends IService<User> {

	boolean register(User user);


}
