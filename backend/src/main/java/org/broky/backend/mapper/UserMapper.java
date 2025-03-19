package org.broky.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.broky.backend.model.User;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}
