package org.broky.backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


public class JsonFileUtil {

	private static final ObjectMapper mapper = new ObjectMapper();
	private static final Object fileLock = new Object();

	static {
		JavaTimeModule module = new JavaTimeModule();

		// 定义你的时间格式，注意这里必须和 JSON 中格式保持一致
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

		// 注册序列化器和反序列化器
		module.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(formatter));
		module.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(formatter));

		mapper.registerModule(module);

		// 禁止写为时间戳
		mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
	}


	public static <T> List<T> readListFromFile(String filePath, Class<T[]> clazz) {
		File file = new File(filePath);
		if (!file.exists()) {
			System.out.println("File not found: " + file.getAbsolutePath());
			return new ArrayList<>();
		}
		try {
			T[] array = mapper.readValue(file, clazz);
			return new ArrayList<>(List.of(array));
		} catch (IOException e) {
			System.err.println("Fail to read JSON File: " + filePath + ", error: " + e.getMessage());
			// 这里改成返回空列表，避免抛异常中断流程
			return new ArrayList<>();
		}
	}


	public static <T> void writeListToFile(String filePath, List<T> list) {
		synchronized (fileLock) {
			try {
				File originalFile = new File(filePath);
				File tmpFile = new File(filePath + ".tmp");

				if (!originalFile.getParentFile().exists()) {
					originalFile.getParentFile().mkdirs();
				}

				mapper.writeValue(tmpFile, list);

				// ✅ 使用 NIO 原子替换
				Files.move(
						tmpFile.toPath(),
						originalFile.toPath(),
						StandardCopyOption.REPLACE_EXISTING,
						StandardCopyOption.ATOMIC_MOVE
				);

			} catch (IOException e) {
				throw new RuntimeException("Fail to safely write JSON File: " + filePath, e);
			}
		}
	}
}
