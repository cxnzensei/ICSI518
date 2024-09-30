package com.icsi518.backend.utils;

import org.mapstruct.Mapper;

import com.icsi518.backend.dtos.UserDto;
import com.icsi518.backend.entities.User;

@Mapper(componentModel = "spring")
public interface MapperUtil {

    UserDto toUserDto(User user);
}
