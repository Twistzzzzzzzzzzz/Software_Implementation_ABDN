package org.broky.backend.model;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@TableName("user")
@AllArgsConstructor
@NoArgsConstructor
public class User {

	@TableId(value = "id", type = IdType.ASSIGN_UUID)
	private String id;

	private String username;

	private String password;

	private String email;

	@TableField(value ="register_time")
	private Date reg_time;
}
