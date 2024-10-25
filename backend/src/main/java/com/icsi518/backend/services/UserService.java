package com.icsi518.backend.services;

import java.nio.CharBuffer;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.icsi518.backend.dtos.CredentialsDto;
import com.icsi518.backend.dtos.SignupDto;
import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.enums.Role;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.mappers.UserMapper;
import com.icsi518.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto findByEmailId(String emailId) {
        User user = userRepository.findByEmailId(emailId)
                .orElseThrow(() -> new ApplicationException("User not found", HttpStatus.NOT_FOUND));

        return userMapper.toUserDto(user);
    }

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByEmailId(credentialsDto.getEmailId())
                .orElseThrow(() -> new ApplicationException("User not found", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }

        throw new ApplicationException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignupDto userDto) {
        Optional<User> optionalUser = userRepository.findByEmailId(userDto.getEmailId());

        if (optionalUser.isPresent()) {
            throw new ApplicationException("Email already exists", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.toUserEntity(userDto);
        user.setRole(Role.USER);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));
        User savedUser = userRepository.save(user);
        return userMapper.toUserDto(savedUser);
    }

}
