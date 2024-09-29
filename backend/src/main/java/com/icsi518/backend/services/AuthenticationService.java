package com.icsi518.backend.services;

import com.icsi518.backend.dtos.LoginDto;
import com.icsi518.backend.dtos.RegisterDto;
import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.repositories.UserRepository;
import com.icsi518.backend.utils.MapperUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Optional;

@Service
@Slf4j
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MapperUtil mapperUtil;

    public User findByEmailId(String email) {
        return userRepository.findUserByEmailId(email)
                .orElseThrow(() -> new ApplicationException("User does not exist"));
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return findByEmailId(jwt.getSubject());
    }

    public ResponseEntity<UserDto> registerUser(RegisterDto registerDto, HttpServletResponse response) {
        UserDto userDto = new UserDto();

        try {
            Optional<User> existingUser = userRepository.findUserByEmailId(registerDto.getEmailId());
            if (existingUser.isPresent()) {
                throw new ApplicationException("Email Already Exists");
            }

            User user = new User();
            user.setEmailId(registerDto.getEmailId());
            user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
            user.setFirstName(registerDto.getFirstName());
            user.setLastName(registerDto.getLastName());
            User registeredUser = userRepository.save(user);

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(registerDto.getEmailId(), registerDto.getPassword()));
            String token = tokenService.generateJWT(auth);

            String jwtCookie = String.format(
                    "jwt=%s; Path=/; HttpOnly; SameSite=Lax; Max-Age=%d",
                    token, 24 * 60 * 60);

            response.setHeader("Set-Cookie", jwtCookie);

            userDto = mapperUtil.toUserDto(registeredUser);

            return ResponseEntity.ok(userDto);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(userDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(userDto);
        }
    }

    public ResponseEntity<UserDto> loginUser(LoginDto loginDto, HttpServletResponse response) {
        UserDto userDto = new UserDto();

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getEmailId(), loginDto.getPassword()));

            String token = tokenService.generateJWT(auth);
            User user = findByEmailId(loginDto.getEmailId());

            // add Secure while hosted over https
            String jwtCookie = String.format(
                    "jwt=%s; Path=/; HttpOnly; SameSite=Lax; Max-Age=%d",
                    token, 24 * 60 * 60);

            response.setHeader("Set-Cookie", jwtCookie);

            userDto = mapperUtil.toUserDto(user);

            return ResponseEntity.ok(userDto);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(userDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(userDto);
        }
    }

    public void updatePassword(LinkedHashMap<String, String> body) {
        log.info(body.toString());
    }

}
