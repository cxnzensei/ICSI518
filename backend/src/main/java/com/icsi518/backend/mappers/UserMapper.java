package com.icsi518.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.icsi518.backend.dtos.SignupDto;
import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    User toUserEntity(SignupDto userDto);
}
