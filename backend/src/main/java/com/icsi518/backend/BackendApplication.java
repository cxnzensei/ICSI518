package com.icsi518.backend;

import com.icsi518.backend.entities.Role;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.repositories.UserRepository;

import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner run(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {

			Optional<User> presentUser = userRepository.findUserByEmailId("team8@albany.edu");

			if (presentUser.isPresent()) {
				return;
			}

			User user = new User();
			user.setEmailId("team8@albany.edu");
			user.setPassword(passwordEncoder.encode("password"));
			user.setFirstName("Team");
			user.setLastName("8");
			user.setRole(Role.valueOf("ADMIN"));
			user.setIsEnabled(true);
			userRepository.save(user);
		};
	}

}
