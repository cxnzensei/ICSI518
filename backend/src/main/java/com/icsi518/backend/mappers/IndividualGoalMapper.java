package com.icsi518.backend.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.icsi518.backend.dtos.IndividualGoalDto;
import com.icsi518.backend.entities.IndividualGoal;

@Mapper(componentModel = "spring")
public interface IndividualGoalMapper {

    @Mapping(source = "account.accountId", target = "account.accountId")
    @Mapping(source = "account.name", target = "account.name")
    @Mapping(target = "accountId", ignore = true)
    IndividualGoalDto toDto(IndividualGoal individualGoal);

    @Mapping(target = "account", ignore = true)
    @Mapping(target = "familyGoal", ignore = true)
    @Mapping(target = "percentage", ignore = true)
    @Mapping(target = "user", ignore = true)
    IndividualGoal toEntity(IndividualGoalDto individualGoalDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "familyGoal", ignore = true)
    @Mapping(target = "percentage", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntityFromDto(IndividualGoalDto individualGoalDto, @MappingTarget IndividualGoal individualGoal);
}
