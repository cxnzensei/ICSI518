package com.icsi518.backend.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.icsi518.backend.dtos.AccountDto;
import com.icsi518.backend.entities.Account;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    AccountDto toAccountDto(Account account);

    @Mapping(target = "user", ignore = true)
    Account toEntity(AccountDto accountDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "user", ignore = true)
    void updateEntityFromDto(AccountDto accountDto, @MappingTarget Account account);
}