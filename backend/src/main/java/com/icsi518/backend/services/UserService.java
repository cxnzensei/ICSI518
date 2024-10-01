package com.icsi518.backend.services;

import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.entities.User;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.repositories.UserRepository;
import com.icsi518.backend.utils.MapperUtil;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MapperUtil mapperUtil;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findUserByEmailId(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Set<GrantedAuthority> authorities = user.getAuthorities()
                .stream().map(role -> new SimpleGrantedAuthority(role.getAuthority()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(user.getEmailId(), user.getPassword(),
                authorities);
    }

    public List<UserDto> findAllUsers() {

        List<User> users = userRepository.findByIsEnabledTrue();
        return users.stream().map(mapperUtil::toUserDto).toList();
    }

    public UserDto updateUser(UUID userId, UserDto body) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException("The user does not exist", HttpStatus.NOT_FOUND));

        if (StringUtils.hasText(body.getFirstName())) {
            user.setFirstName(body.getFirstName());
        }

        if (StringUtils.hasText(body.getLastName())) {
            user.setLastName(body.getLastName());
        }

        User updatedUser = userRepository.save(user);
        return mapperUtil.toUserDto(updatedUser);
    }

    public String deleteUser(UUID userId) {

        userRepository.deleteById(userId);
        return "User Deleted Successfully";
    }
}
