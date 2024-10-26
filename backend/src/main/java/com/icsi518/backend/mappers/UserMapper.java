package com.icsi518.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.icsi518.backend.dtos.SignupDto;
import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.dtos.UserMinimalDto;
import com.icsi518.backend.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "familyId", source = "family.id")
    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "membershipStatus", ignore = true)
    @Mapping(target = "family", ignore = true)
    User toUser(SignupDto userDto);

    UserMinimalDto toUserMinimalDto(User user);
}
