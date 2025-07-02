package com.chat.ChatDemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = "com.chat")
@EnableMongoRepositories(basePackages = "com.chat.repo")
public class ChatDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatDemoApplication.class, args);
		System.out.println("Application starts running on port 9090");
	}


}
